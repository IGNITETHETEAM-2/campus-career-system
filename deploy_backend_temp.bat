@echo off
setlocal enabledelayedexpansion
cd backend

echo Configuring Git...
git config user.email "mohammedmuzhirtaha@gmail.com"
git config user.name "Mohammed Muzhir Taha"

echo Linking project...
call vercel link --yes

set "MONGO_URI=mongodb+srv://mohammedmuzhirtaha:mohammedmuzhirtaha@cluster0.annsvcl.mongodb.net/campus-career?retryWrites=true&w=majority"
set "JWT_SECRET=mysecretkey123"

echo Setting env vars...
:: Env vars might be added already, errors are ignored
(echo !MONGO_URI!& echo n) | vercel env add MONGO_URI production
(echo !JWT_SECRET!& echo n) | vercel env add JWT_SECRET production
(echo !MONGO_URI!& echo n) | vercel env add MONGO_URI preview
(echo !JWT_SECRET!& echo n) | vercel env add JWT_SECRET preview

echo Deploying...
call vercel --prod --yes --force > ..\backend_url.txt
type ..\backend_url.txt
