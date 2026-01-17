#!/bin/bash

# Remplacer les références d'images mockées par des URLs placeholder
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/400\/300?random=1'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-10'/_ref: 'https:\/\/picsum.photos\/400\/300?random=10'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-11'/_ref: 'https:\/\/picsum.photos\/400\/300?random=11'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-12'/_ref: 'https:\/\/picsum.photos\/400\/300?random=12'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-13'/_ref: 'https:\/\/picsum.photos\/400\/300?random=13'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-14'/_ref: 'https:\/\/picsum.photos\/400\/300?random=14'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-15'/_ref: 'https:\/\/picsum.photos\/400\/300?random=15'/g" src/components/sections/ContentSection.tsx
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/800\/600?random=1'/g" src/components/sections/HeroSection.tsx
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/400\/300?random=1'/g" src/components/sections/AmuseBoucheSection.tsx
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/400\/300?random=1'/g" src/pages/AllArticlesPage.tsx
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/400\/300?random=1'/g" src/pages/CategoryPage.tsx
sed -i '' "s/_ref: 'image-1'/_ref: 'https:\/\/picsum.photos\/400\/300?random=1'/g" src/pages/HomePage.tsx

# Remplacer toutes les autres références image-X
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' "s/_ref: 'image-\([0-9]\+\)'/_ref: 'https:\/\/picsum.photos\/400\/300?random=\1'/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i '' "s/_ref: 'image-mock-\([^']*\)'/_ref: 'https:\/\/picsum.photos\/400\/300?random=mock'/g"
