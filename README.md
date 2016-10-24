DnD 5th Edition Helper for Slack
================================

This is a little helper I built for our DnD slack group.

Currently it can list it's commands:

```
Gisleburt  
/5e help

5th Edition Helper BOT  
The following commands are currently available
`/5e help` - Lists available commands 
`/5e roll` - Roll a dice. Eg: /5e roll d20 
```

And fail to roll any dice:

```
Gisleburt
/5e roll 20d6

5th Edition Helper BOT
Ohps, dropped my dice!
```

Running your own
----------------

1. Add a new Slack "slash" integration to your slack group.
2. Copy `settings.example` to `settings`.
3. Copy the "slash" integration token into `settings`
4. Run `npm run build` to create `dist/aws.lambda.js`
5. Copy the contents into your AWS lambda function.
