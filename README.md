# Raycast Toggl Goals Extension

Track your Toggl goals in Raycast.

This Raycast extension allows users to see their Toggl progress in Raycast, allowing them to assess their progress and goals for each project quickly.

## Features

- View a list of Toggl projects with their progress and goals
- Update goals for individual projects
- Open project details in the browser
- Filter projects using the search bar

## Installation

Clone this repository:

```bash
git clone https://github.com/yourusername/raycast-toggl-reports.git
```

Install the required dependencies:

```bash
cd raycast-toggl-reports
npm install
```

Build the extension:

```bash
npm run build
```

Open Raycast and go to Extensions > My Extensions.
Click on "Add Extension" and select the raycast-toggl-reports folder.
Configuration

To use this extension, you need to provide your Toggl API key and your Toggl workspace ID.

Enter your Toggl API key and your Toggl workspace ID in the appropriate fields.

Save the preferences by clicking on the "Save" button.

If you don't know yout workspace id , you can use this command to get it:

```bash
echo -n "your_toggl_api_key:api_token" | base64

curl -X GET -H "Authorization: Basic YOUR_BASE64_ENCODED_API_KEY" https://api.track.toggl.com/api/v8/workspaces
```

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

Or you can get it from the Toggl website url:
Example
https://track.toggl.com/213213/settings/general

Your workspace id is 213213

## Usage

Open Raycast.
Navigate to the Toggl Reports extension.
View the list of projects, their progress, and goals.
Click on a project to view its details and update its goal.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for any bugs, feature requests, or suggestions.

License

This project is licensed under the MIT License. See LICENSE for more information.

# Get your toggl report from raycast

This extension allow you to see your progress in Raycast.

Roadmap

- [x] Add goals to local storage from detail page
- [ ] Add active project with a icon on listing page
- [ ] Add change log
- [ ] Add tests
- [ ] Starting Toggle timer of a project with blank task name from Raycast
