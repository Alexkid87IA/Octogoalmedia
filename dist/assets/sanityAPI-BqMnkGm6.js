import{j as c}from"./sanity-b907zOyg.js";import{p as l,s as a}from"./index-D76ALfcR.js";const y=({size:e="medium",color:t="blue",text:o})=>{const r={small:"w-5 h-5",medium:"w-8 h-8",large:"w-12 h-12"},s={blue:"text-accent-blue",white:"text-white",gray:"text-gray-300"};return c.jsxs("div",{className:"flex flex-col items-center justify-center",role:"status","aria-live":"polite",children:[c.jsxs("svg",{className:`animate-spin ${r[e]} ${s[t]}`,xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","aria-hidden":"true",children:[c.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),c.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),o&&c.jsx("span",{className:`mt-2 ${s[t]}`,children:o}),c.jsx("span",{className:"sr-only",children:"Chargement en cours"})]})},u={},g=5*60*1e3;async function n(e,t){const o=Date.now(),r=u[e];if(r&&o-r.timestamp<g)return console.log(`Utilisation du cache pour ${e}`),r.data;try{const s=await t();return u[e]={data:s,timestamp:o},s}catch(s){throw console.error(`Erreur lors de la récupération des données pour ${e}:`,s),s}}const _=async()=>n("allArticles",async()=>{try{const t=await a.fetch(`*[_type == "article"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`);if(console.log(`Articles récupérés: ${(t==null?void 0:t.length)||0}`),t&&t.length>0){const o=[...new Set(t.map(r=>r.contentType))];console.log("Types de contenu disponibles:",o),console.log("Premier article mainImage:",t[0].mainImage)}return t||[]}catch(e){return console.error("Erreur lors de la récupération des articles:",e),[]}}),h=async(e,t=!1)=>{if(console.log("🔍 getArticleBySlug appelé avec:",{slug:e,preview:t}),t)try{console.log("🔍 Utilisation du previewClient"),console.log("📊 Configuration du previewClient:",{dataset:l.config().dataset,perspective:l.config().perspective,hasToken:!!l.config().token});const o=`*[_type == "article" && slug.current == $slug][0] {
        _id,
        _rev,
        _type,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        body,
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`;console.log("🔍 Exécution de la requête preview pour slug:",e),console.log("🔎 Requête GROQ:",o);const r=await l.fetch(o,{slug:e});if(console.log("✅ Résultat de la requête preview:",{found:!!r,id:r==null?void 0:r._id,title:r==null?void 0:r.title,contentType:r==null?void 0:r.contentType,keyPoints:r==null?void 0:r.keyPoints,isPublished:(r==null?void 0:r._id)&&!r._id.startsWith("drafts.")}),!r){console.log("⚠️ Aucun article trouvé, recherche des brouillons...");const s=`*[_type == "article" && (_id match "drafts.*") && slug.current == $slug][0] {
          _id,
          _rev,
          _type,
          title,
          slug,
          contentType,
          mainImage {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          body,
          excerpt,
          publishedAt,
          keyPoints,
          readingTime,
          duration,
          videoUrl,
          guest,
          isEssential,
          isTrending,
          isFeatured,
          stats,
          categories[]->{
            _id,
            title,
            slug
          },
          subcategories[]->{
            _id,
            title,
            slug,
            parentCategory->{
              _id,
              title,
              slug
            }
          },
          author->{
            _id,
            name,
            "imageUrl": image.asset->url,
            image {
              asset->{
                _ref,
                _type,
                url
              },
              hotspot,
              crop
            },
            bio
          }
        }`;console.log("🔎 Requête spécifique brouillons:",s);const i=await l.fetch(s,{slug:e});return console.log("📋 Résultat recherche brouillons:",{found:!!i,id:i==null?void 0:i._id,contentType:i==null?void 0:i.contentType,keyPoints:i==null?void 0:i.keyPoints}),i}return r}catch(o){return console.error(`❌ Erreur lors de la récupération preview de l'article ${e}:`,o),console.error("Détails de l'erreur:",o),null}return console.log("📚 Utilisation du mode normal (avec cache)"),n(`article_${e}`,async()=>{var o;try{const s=await a.fetch(`*[_type == "article" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        body,
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        },
        author->{
          _id,
          name,
          "imageUrl": image.asset->url,
          image {
            asset->{
              _ref,
              _type,
              url
            },
            hotspot,
            crop
          },
          bio
        }
      }`,{slug:e});return console.log("📋 Article récupéré avec contentType:",s==null?void 0:s.contentType),console.log("🎯 Hotspot data:",(o=s==null?void 0:s.mainImage)==null?void 0:o.hotspot),s}catch(r){return console.error(`Erreur lors de la récupération de l'article ${e}:`,r),null}})},m=async e=>n(`articles_category_${e}`,async()=>{try{const o=await a.fetch('*[_type == "category" && slug.current == $categorySlug][0]._id',{categorySlug:e});if(!o)return console.log(`Catégorie non trouvée pour le slug: ${e}`),[];const s=await a.fetch(`*[_type == "article" && references($categoryId)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isEssential,
        isTrending,
        isFeatured,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        }
      }`,{categoryId:o});return console.log(`Articles trouvés pour ${e}: ${s.length}`),s}catch(t){return console.error(`Erreur lors de la récupération des articles de la catégorie ${e}:`,t),[]}}),f=async e=>n(`category_${e}`,async()=>{try{return await a.fetch(`*[_type == "category" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description
      }`,{slug:e})}catch(t){return console.error(`Erreur lors de la récupération de la catégorie ${e}:`,t),null}}),b=async e=>n(`articles_subcategory_${e}`,async()=>{try{const o=await a.fetch('*[_type == "subcategory" && slug.current == $subcategorySlug][0]._id',{subcategorySlug:e});if(!o)return console.log(`Sous-catégorie non trouvée pour le slug: ${e}`),[];const s=await a.fetch(`*[_type == "article" && references($subcategoryId)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        contentType,
        mainImage {
          asset->{
            _ref,
            _type,
            url
          },
          hotspot,
          crop
        },
        excerpt,
        publishedAt,
        keyPoints,
        readingTime,
        duration,
        videoUrl,
        guest,
        isTrending,
        isFeatured,
        isEssential,
        stats,
        categories[]->{
          _id,
          title,
          slug
        },
        subcategories[]->{
          _id,
          title,
          slug,
          parentCategory->{
            _id,
            title,
            slug
          }
        }
      }`,{subcategoryId:o});return console.log(`Articles trouvés pour ${e}: ${s.length}`),s}catch(t){return console.error(`Erreur lors de la récupération des articles de la sous-catégorie ${e}:`,t),[]}}),$=async e=>n(`subcategory_${e}`,async()=>{try{return await a.fetch(`*[_type == "subcategory" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        parentCategory->{
          _id,
          title,
          slug
        }
      }`,{slug:e})}catch(t){return console.error(`Erreur lors de la récupération de la sous-catégorie ${e}:`,t),null}}),w=async()=>n("allEmissions",async()=>{try{const t=await a.fetch(`*[_type == "article" && contentType == "emission"] | order(publishedAt desc) {
        _id,
        title,
        "description": excerpt,
        "thumbnail": mainImage.asset->url,
        "slug": slug.current,
        "duration": duration,
        publishedAt,
        "featured": isFeatured,
        "listens": coalesce(stats.views, 0),
        "likes": coalesce(stats.likes, 0),
        "videoUrlExternal": videoUrl,
        "category": categories[0]->title,
        "guest": guest
      }`);return console.log(`Émissions récupérées: ${(t==null?void 0:t.length)||0}`),t||[]}catch(e){return console.error("Erreur lors de la récupération des émissions:",e),[]}});export{y as L,f as a,m as b,$ as c,b as d,w as e,h as f,_ as g};
