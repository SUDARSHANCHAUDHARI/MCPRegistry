export function validateSubmission(form: {
  name: string
  description: string
  github_url: string
  install_command: string
}) {
  const errors: Record<string, string> = {}

  if (!form.name || form.name.length < 3) {
    errors.name = 'Name must be at least 3 characters'
  }
  if (form.name.length > 50) {
    errors.name = 'Name must be under 50 characters'
  }

  if (!form.description || form.description.length < 20) {
    errors.description = 'Description must be at least 20 characters'
  }
  if (form.description.length > 200) {
    errors.description = 'Description must be under 200 characters'
  }

  if (!form.github_url.startsWith('https://github.com/')) {
    errors.github_url = 'Must be a valid GitHub URL (https://github.com/...)'
  }

  if (!form.install_command.trim()) {
    errors.install_command = 'Install command is required'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}
