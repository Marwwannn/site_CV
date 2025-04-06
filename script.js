document.addEventListener('DOMContentLoaded', function() {
    // Code pour le menu mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Fonction pour basculer le menu
    function toggleMenu() {
        navMenu.classList.toggle('active');
    }

    // Event listener pour le bouton hamburger
    if (navToggle) {
        navToggle.addEventListener('click', toggleMenu);
    }

    // Fermer le menu quand on clique sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Ajouter la fonctionnalité de défilement horizontal par drag and drop pour les projets
    const projectsContainer = document.querySelector('.projects-grid');
    
    if (projectsContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Ajouter la classe qui indique que le conteneur est draggable
        projectsContainer.classList.add('draggable');
        
        // Lorsque l'utilisateur appuie sur le bouton de la souris
        projectsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            projectsContainer.classList.add('active');
            startX = e.pageX - projectsContainer.offsetLeft;
            scrollLeft = projectsContainer.scrollLeft;
        });
        
        // Lorsque l'utilisateur sort du conteneur ou relâche le bouton
        projectsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            projectsContainer.classList.remove('active');
        });
        
        projectsContainer.addEventListener('mouseup', () => {
            isDown = false;
            projectsContainer.classList.remove('active');
        });
        
        // Déplacer le contenu horizontal pendant que l'utilisateur maintient le bouton enfoncé
        projectsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - projectsContainer.offsetLeft;
            const walk = (x - startX) * 2; // Vitesse de défilement
            projectsContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Support tactile pour les appareils mobiles
        projectsContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            projectsContainer.classList.add('active');
            startX = e.touches[0].pageX - projectsContainer.offsetLeft;
            scrollLeft = projectsContainer.scrollLeft;
        }, { passive: true });
        
        projectsContainer.addEventListener('touchend', () => {
            isDown = false;
            projectsContainer.classList.remove('active');
        });
        
        projectsContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - projectsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            projectsContainer.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    }

    // Navigation des projets vers les compétences
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Vérifier si l'utilisateur est en train de faire défiler les projets
            if (isDown) return;
            
            // Si le projet est déjà en surbrillance, on désélectionne tout
            if (this.classList.contains('highlighted')) {
                document.querySelectorAll('.project-card').forEach(p => p.classList.remove('highlighted'));
                document.querySelectorAll('.skill-item').forEach(s => s.classList.remove('highlighted'));
            } else {
                // Sinon, on applique la surbrillance normale
                document.querySelectorAll('.project-card').forEach(p => p.classList.remove('highlighted'));
                this.classList.add('highlighted');
                highlightSkills(this.getAttribute('data-skills').split(','));
            }
        });
    });

    // Navigation des compétences vers les projets
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(skill => {
        skill.addEventListener('click', function() {
            // Si la compétence est déjà en surbrillance, on désélectionne tout
            if (this.classList.contains('highlighted')) {
                document.querySelectorAll('.skill-item').forEach(s => s.classList.remove('highlighted'));
                document.querySelectorAll('.project-card').forEach(p => p.classList.remove('highlighted'));
                return;
            }

            // Récupère la classe de compétence
            const skillClass = Array.from(this.classList)
                .find(cls => ['realiser', 'optimiser', 'administrer', 'gerer', 'conduire', 'collaborer'].includes(cls));
            
            // Supprime les highlights précédents
            document.querySelectorAll('.project-card').forEach(project => {
                project.classList.remove('highlighted');
            });
            document.querySelectorAll('.skill-item').forEach(s => s.classList.remove('highlighted'));

            // Ajoute le highlight à la compétence cliquée
            this.classList.add('highlighted');

            // Trouve et highlight les projets correspondants
            let firstHighlight = true;
            document.querySelectorAll('.project-card').forEach(project => {
                const projectSkills = project.getAttribute('data-skills').split(',');
                if (projectSkills.includes(skillClass)) {
                    project.classList.add('highlighted');
                    if (firstHighlight) {
                        project.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        firstHighlight = false;
                    }
                }
            });
        });
    });

    // Code pour le formulaire de contact dans la nouvelle structure
    const form = document.getElementById('contact-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Réinitialiser le formulaire
                    form.reset();
                    
                    // Afficher le message de confirmation
                    if (confirmationMessage) {
                        confirmationMessage.style.display = 'flex';
                        
                        // Faire défiler jusqu'en haut de la page
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        
                        // Cacher le message après 3 secondes
                        setTimeout(() => {
                            confirmationMessage.style.display = 'none';
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        });
    }
});

// Déclaration de la variable isDown en dehors du DOMContentLoaded pour qu'elle soit accessible par d'autres fonctions
let isDown = false;

// Fonction pour highlighter les compétences
function highlightSkills(skills) {
    // Supprime d'abord tous les highlights
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.classList.remove('highlighted');
    });
    
    // Ajoute le highlight aux compétences concernées
    skills.forEach(skillName => {
        const skillElement = document.querySelector(`.skill-item.${skillName}`);
        if (skillElement) {
            skillElement.classList.add('highlighted');
            // Scroll vers la première compétence
            if (skillName === skills[0]) {
                skillElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });
}

function scrollToProject(projectId) {
    const projectElement = document.getElementById(projectId);
    if (projectElement) {
        projectElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Ajoute un effet visuel
        projectElement.classList.add('highlighted');
        setTimeout(() => {
            projectElement.classList.remove('highlighted');
        }, 2000);
    }
} 