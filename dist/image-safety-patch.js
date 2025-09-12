// Patch global pour intercepter les erreurs de manipulation d'images
// Ce script est injecté au niveau global pour éviter les erreurs de type ft(...).width
// en interceptant toutes les tentatives d'appel à width sur des objets potentiellement invalides

(function() {
  // Sauvegarde des méthodes originales qui pourraient être utilisées
  const originalImageUrlBuilder = window.imageUrlBuilder;
  
  // Fonction de sécurisation pour les appels à width, height, etc.
  function secureSanityImageMethod(obj, methodName) {
    if (!obj) return obj;
    
    const originalMethod = obj[methodName];
    if (typeof originalMethod !== 'function') return obj;
    
    obj[methodName] = function(...args) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        console.warn(`Erreur interceptée lors de l'appel à ${methodName}:`, error);
        // Retourner l'objet lui-même pour permettre le chaînage
        return obj;
      }
    };
    
    return obj;
  }
  
  // Intercepter les appels à urlFor pour sécuriser les méthodes chaînées
  const originalUrlFor = window.urlFor;
  if (typeof originalUrlFor === 'function') {
    window.urlFor = function(source) {
      try {
        const result = originalUrlFor(source);
        
        // Si le résultat est un objet avec des méthodes chaînables, sécuriser ces méthodes
        if (result && typeof result === 'object') {
          secureSanityImageMethod(result, 'width');
          secureSanityImageMethod(result, 'height');
          secureSanityImageMethod(result, 'auto');
          secureSanityImageMethod(result, 'url');
        }
        
        return result;
      } catch (error) {
        console.warn('Erreur interceptée dans urlFor:', error);
        // Retourner un objet factice avec les méthodes attendues
        return {
          width: () => ({ height: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
          height: () => ({ width: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
          auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }),
          url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible'
        };
      }
    };
  }
  
  // Intercepter les appels à imageUrlBuilder pour sécuriser les méthodes chaînées
  if (typeof originalImageUrlBuilder === 'function') {
    window.imageUrlBuilder = function(...args) {
      try {
        const builder = originalImageUrlBuilder(...args);
        
        if (builder && typeof builder.image === 'function') {
          const originalImage = builder.image;
          builder.image = function(source) {
            try {
              const result = originalImage.call(this, source);
              
              // Sécuriser les méthodes chaînables
              secureSanityImageMethod(result, 'width');
              secureSanityImageMethod(result, 'height');
              secureSanityImageMethod(result, 'auto');
              secureSanityImageMethod(result, 'url');
              
              return result;
            } catch (error) {
              console.warn('Erreur interceptée dans builder.image:', error);
              // Retourner un objet factice avec les méthodes attendues
              return {
                width: () => ({ height: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
                height: () => ({ width: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
                auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }),
                url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible'
              };
            }
          };
        }
        
        return builder;
      } catch (error) {
        console.warn('Erreur interceptée dans imageUrlBuilder:', error);
        return {
          image: () => ({
            width: () => ({ height: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
            height: () => ({ width: () => ({ auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }) }) }),
            auto: () => ({ url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible' }),
            url: () => 'https://via.placeholder.com/800x450?text=Image+Indisponible'
          })
        };
      }
    };
  }
  
  console.log('Patch global de sécurisation des images chargé avec succès');
})();
