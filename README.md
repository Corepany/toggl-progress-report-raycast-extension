# Get your toggl report from raycast

This extension allow you to see your progress in Raycast.

To get workspace id, you can use this command:

echo -n "your_toggl_api_key:api_token" | base64

curl -X GET -H "Authorization: Basic YOUR_BASE64_ENCODED_API_KEY" https://api.track.toggl.com/api/v8/workspaces

Example response

```json
[
  {
    "id": 1234567,
    "name": "Your Workspace",
    "profile": 1
  }
]
```
