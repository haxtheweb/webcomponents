# Continue + Penn State AI Studio Setup

This folder provides a starter Continue configuration for Azure-based AI Studio.

## 1) Fill in `.continue/config.yaml`

Replace the placeholders:

- `REPLACE_WITH_RESOURCE_NAME`
  - Your Azure OpenAI resource host prefix.
  - Example endpoint in Azure portal: `https://my-resource.openai.azure.com/`
  - In this case, `my-resource` is the resource name.

- `REPLACE_WITH_CHAT_DEPLOYMENT_NAME`
  - The exact Azure deployment name you use for chat.

- `REPLACE_WITH_AUTOCOMPLETE_DEPLOYMENT_NAME`
  - A fast model deployment name for autocomplete (optional).

- `REPLACE_WITH_API_KEY`
  - Your Azure AI Studio / Azure OpenAI key.

## 2) Restart VS Code

Reload window after editing config so Continue picks up changes.

## 3) Validate in Continue

- Open Continue chat.
- Ask a small prompt like: `Reply with OK and model name`.
- If it fails, verify `apiBase`, `model` deployment names, and `apiVersion`.

## Security note

Avoid committing real API keys. Keep keys local-only or switch `apiKey` to an environment variable once confirmed working.
