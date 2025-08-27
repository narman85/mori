// OAuth user ID generation utility
export const generateOAuthUserId = (email: string): string => {
  // Consistent OAuth ID generation across the app
  return `oauth-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

export const extractEmailFromOAuthId = (oauthId: string): string => {
  if (!oauthId.startsWith('oauth-')) return '';
  
  // Reverse the transformation
  const emailPart = oauthId.replace('oauth-', '');
  // This is a simplified reverse - might not be perfect for complex emails
  return emailPart.replace(/_/g, '.');
};

export const isOAuthUserId = (userId: string): boolean => {
  return userId.startsWith('oauth-') || userId.startsWith('temp-') || userId.startsWith('google-');
};

// Better way to detect OAuth users - by checking user object properties
export const isOAuthUser = (user: any): boolean => {
  // Check if user has OAuth characteristics:
  // 1. No username (OAuth users typically don't set usernames)
  // 2. Has email
  // 3. Has name (from OAuth provider)
  // 4. ID doesn't look like manual registration
  
  if (!user) return false;
  
  // First check the old way (for temp/oauth prefixed IDs)
  if (user.id && (user.id.startsWith('oauth-') || user.id.startsWith('temp-') || user.id.startsWith('google-'))) {
    return true;
  }
  
  // Then check for OAuth characteristics
  // OAuth users typically have no username but have name and email
  const hasNoUsername = !user.username || user.username === user.email;
  const hasName = user.name && user.name.trim().length > 0;
  const hasEmail = user.email && user.email.includes('@');
  
  return hasNoUsername && hasName && hasEmail;
};