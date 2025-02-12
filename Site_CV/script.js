document.addEventListener('DOMContentLoaded', function() {
    // Navigation des projets vers les compétences
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
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
});

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