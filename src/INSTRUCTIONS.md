# 🧠 تعليمات التطوير - Wemarka Accountant

## 🎨 الوضع الداكن
- تأكد من أن كل الصفحات والمكونات تستخدم `dark:` من Tailwind
- `ThemeContext.js` يقوم بإدارة الثيم عبر LocalStorage

## 🧾 الإدخالات
- استخدم `firebaseOperations.js` لحفظ واسترجاع البيانات
- نظّم النماذج داخل `features/<feature>/`

## 📊 لوحة التحكم
- تم نقلها إلى `features/dashboard/`
- استخدم مكونات قابلة لإعادة الاستخدام لعرض البطاقات

## 📁 التنظيم
- كل ميزة الآن داخل مجلد خاص في `features/`
- مكونات layout مثل Sidebar, Header أصبحت في `components/layout/`
- خدمات البيانات في `services/`, وأدوات مساعدة في `utils/`

