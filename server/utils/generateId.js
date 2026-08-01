export const generateRegistrationId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 5; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HV26-${random}`;
};

export const generateCertificateCode = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CERT-HV2026-${num}`;
};
