// التحقق من صحة البريد الإلكتروني
export function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  // التحقق من قوة كلمة المرور
  export function isStrongPassword(password: string): boolean {
    // على الأقل 8 أحرف، حرف كبير، حرف صغير، رقم، ورمز
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  }
  
  // توليد رمز OTP عشوائي مكوّن من 6 أرقام
  export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // تشفير نص باستخدام base64 (تجريبي فقط)
  export function encryptBase64(text: string): string {
    return Buffer.from(text).toString('base64');
  }
  
  // فك التشفير base64
  export function decryptBase64(encoded: string): string {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
  
  // تنسيق التاريخ بشكل مبسط
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
  