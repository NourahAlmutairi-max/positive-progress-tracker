import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/setup-assistant')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json()

          const goal = body.goal?.trim()
          const model = body.model || 'openrouter/free'

          if (!goal) {
            return Response.json(
              { error: 'Please tell us what kind of setup you need.' },
              { status: 400 },
            )
          }

          // Normal API
          const adviceResponse = await fetch(
            'https://api.adviceslip.com/advice',
            { cache: 'no-store' },
          )

          if (!adviceResponse.ok) {
            return Response.json(
              { error: 'The advice service is unavailable. Please try again.' },
              { status: 502 },
            )
          }

          const adviceData = await adviceResponse.json()
          const advice =
            adviceData?.slip?.advice || 'Keep your setup simple and practical.'

          // Secret stays on the server
          const apiKey = process.env.OPENROUTER_API_KEY

          if (!apiKey) {
            return Response.json(
              { error: 'AI service is not configured.' },
              { status: 500 },
            )
          }

          // Send normal API result automatically inside AI prompt
          const aiResponse = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model,
                messages: [
                  {
                    role: 'system',
                    content:
                      'You are TECH PREMIUM AI Setup Assistant. Give short, useful desk setup recommendations for students, coders, gamers and productivity users.',
                  },
                  {
                    role: 'user',
                    content: `
Customer needs:
${goal}

Real advice received from our external API:
"${advice}"

Use that API advice as inspiration.

Recommend a practical TECH PREMIUM setup in 2-4 short sentences.
Mention useful products such as a keyboard, mouse, laptop stand, audio accessory or desk accessory when relevant.
                    `,
                  },
                ],
              }),
            },
          )

          // Bonus: specific rate-limit error
          if (aiResponse.status === 429) {
            return Response.json(
              {
                error:
                  'The AI service is temporarily rate limited. Please wait a moment and try again.',
              },
              { status: 429 },
            )
          }

          if (!aiResponse.ok) {
            return Response.json(
              {
                error:
                  'The AI recommendation service is unavailable. Please try again.',
              },
              { status: 502 },
            )
          }

          const aiData = await aiResponse.json()

          const recommendation =
            aiData?.choices?.[0]?.message?.content

          if (!recommendation) {
            return Response.json(
              { error: 'The AI did not generate a recommendation.' },
              { status: 502 },
            )
          }

          return Response.json({
            advice,
            recommendation,
            model,
          })
        } catch (error) {
          console.error(error)

          return Response.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 },
          )
        }
      },
    },
  },
})
