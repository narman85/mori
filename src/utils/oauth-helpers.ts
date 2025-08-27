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