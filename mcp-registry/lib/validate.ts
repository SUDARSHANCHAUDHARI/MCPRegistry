export function validateSubmission(form: {
  name: string
  description: string
  github_url: string
  install_command: string
}) {
  const errors: Record<string, string> = {}

  const name = form.name?.trim() || ''
  const description = form.description?.trim() || ''
  const github_url = form.github_url?.trim() || ''
  const install_command = form.install_command?.trim() || ''

  if (!name || name.length < 3) {
    errors.name = 'Name must be at least 3 characters'
  } else if (name.length > 100) {
    errors.name = 'Name must be under 100 characters'
  }

  if (!description || description.length < 20) {
    errors.description = 'Description must be at least 20 characters'
  } else if (description.length > 500) {
    errors.description = 'Description must be under 500 characters'
  }

  if (!github_url) {
    errors.github_url = 'GitHub URL is required'
  } else {
    try {
      const parsed = new URL(github_url)
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') {
        errors.github_url = 'Must be a valid GitHub URL (https://github.com/owner/repo)'
      } else {
        const parts = parsed.pathname.replace(/^\//, '').split('/')
        if (parts.length < 2 || !parts[0] || !parts[1]) {
          errors.github_url = 'URL must include owner and repository (https://github.com/owner/repo)'
        }
      }
    } catch {
      errors.github_url = 'Must be a valid URL'
    }
  }

  if (!install_command) {
    errors.install_command = 'Install command is required'
  } else if (install_command.length > 500) {
    errors.install_command = 'Install command must be under 500 characters'
  }

  return { errors, isValid: Object.keys(errors).length === 0 }
}
