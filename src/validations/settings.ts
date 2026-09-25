export function validateInvite({ name, email }: { name: string; email: string }): string {
  if (!name.trim() || !email.trim() || !email.includes('@')) {
    return 'Please enter name and a valid email.';
  }
  return '';
}

export function validateIndustryName(name: string): string {
  if (!name.trim()) return 'Please enter an industry name.';
  return '';
}
