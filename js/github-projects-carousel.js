(function () { // IIFE

    const app = globalThis.app;

    const projectsData = {
        "projects": [
            {
                "name": "nzr.diagnostics",
                "description": "A collection of diagnostic utilities and tools, structured as multiple inner projects distributed as individual packages",
                "link": "https://github.com/marionzr/nzr.diagnostics",
                "nuget": ["Nzr.Diagnostics.OperationTagGenerator", "Nzr.Diagnostics.HealthChecks"]
            },
            {
                "name": "nzr.nano",
                "description": "Nano (Not another number obfuscator) is a lightweight and configurable library for obfuscating and deobfuscating numeric values.",
                "link": "https://github.com/marionzr/nzr.nano",
                "nuget": ["Nzr.Nano"]
            },
            {
                "name": "nzr.acme ⭐",
                "description": "Nzr.Acme is a template/bootstrap .NET project designed to serve as a foundation for small-medium projects. This is an evolving project where I'm testing the latest features of different frameworks or simply applying my latest learnings.",
                "link": "https://github.com/marionzr/nzr.acme",
                "nuget": []
            },
            {
                "name": "nzr.toolbox",
                "description": "Extension methods that allow C# developers write less code.",
                "link": "https://github.com/marionzr/nzr.toolbox",
                "nuget": ["Nzr.Toolbox.Core", "Nzr.Toolbox.Core.Single"]
            },
            {
                "name": "nzr.snapshot.xunit.extensions",
                "description": "Extension methods for Snapshooter and Snapshooter.Xunit.",
                "link": "https://github.com/marionzr/nzr.snapshot.xunit.extensions",
                "nuget": ["Nzr.Snapshot.Xunit.Extensions"]
            },
            {
                "name": "nzr.dombs",
                "description": "DOMBS (DOMinator Bookmark Suite): A powerful set of JavaScript bookmarklets to automate, manipulate, and customize webpages with a single click.",
                "link": "https://github.com/marionzr/nzr.dombs",
                "nuget": []
            },
            {
                "name": "marionzr.github.io",
                "description": "The source code of this website.",
                "link": "https://github.com/marionzr/marionzr.github.io",
                "nuget": []
            }
        ]
    };

    let projectList = document.getElementById('gh-projects-carousel-project-list');
    let projectDetails = document.getElementById('gh-projects-carousel-project-details');
    let dotsContainer = document.getElementById('gh-projects-carousel-dots');

    let projects = [];

    function loadProjects() {
        try {
            // Clear existing content
            projectList.innerHTML = '';
            projectDetails.innerHTML = '';
            dotsContainer.innerHTML = '';
            projects = projectsData.projects;

            // Create navigation items
            projects.forEach((project, index) => {
                // Create list item
                const listItem = document.createElement('li');
                listItem.className = 'gh-projects-carousel-project-item';

                listItem.innerHTML = `
                <button class="gh-projects-carousel-project-select-btn" data-index="${index}">
                    ${project.name}
                </button>`;

                projectList.appendChild(listItem);

                // Create dot (for mobile view)
                const dot = document.createElement('button');
                dot.className = 'gh-projects-carousel-dot';
                dot.setAttribute('aria-label', `Go to project ${index + 1}`);
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            });
        } catch (error) {
            app.onError(error, 'Failed to load projects');
        }
    }

    function createProjectCard(project) {
        try {
            const card = document.createElement('div');
            card.className = 'gh-projects-carousel-project-card';

            card.innerHTML = `
                <h2 class="gh-projects-carousel-project-title">
                    <a href="${project.link}" class="gh-projects-carousel-project-link" target="_blank">
                        ${project.name}
                    </a>
                </h2>
                <p class="gh-projects-carousel-project-description">${project.description}</p>
                <div class="gh-projects-carousel-project-last-commit"></div>
                <p class="gh-projects-carousel-nuget-pages-title">Nuget Packages:</p>
                <div class="gh-projects-carousel-project-badges">
                </div>`;

            // Add GitHub last commit badge
            const lastCommitContainer = card.querySelector('.gh-projects-carousel-project-last-commit');

            const lastCommitBadge = document.createElement('img');
            lastCommitBadge.classList.add('img-no-hide')
            lastCommitBadge.src = `https://img.shields.io/github/last-commit/${project.link.split('github.com/')[1]}`;
            lastCommitBadge.alt = 'GitHub last commit';
            lastCommitContainer.appendChild(lastCommitBadge);

            const badgesContainer = card.querySelector('.gh-projects-carousel-project-badges');
            const nugetPagesTitle = card.querySelector('.gh-projects-carousel-nuget-pages-title');
            nugetPagesTitle.style.display = project.nuget.length > 0 ? '' : 'none';

            // Add badges for each NuGet package
            for (const packageName of project.nuget) {
                const badges = [
                    {
                        src: `https://img.shields.io/nuget/v/${packageName}`,
                        alt: 'NuGet Version'
                    },
                    {
                        src: `https://img.shields.io/nuget/dt/${packageName}`,
                        alt: 'NuGet Downloads'
                    }
                ];

                const divNuget = document.createElement('div');
                divNuget.className = 'gh-projects-carousel-nuget-package';
                const nugetPackageName = document.createElement('span');
                nugetPackageName.className = 'gh-projects-carousel-nuget-package-name';
                nugetPackageName.textContent = packageName;
                divNuget.append(nugetPackageName);

                badges.forEach(badge => {
                    const img = document.createElement('img');
                    img.classList.add('gh-projects-carousel-nuget-package-badge-img');
                    img.classList.add('img-no-hide');
                    img.src = badge.src;
                    img.alt = badge.alt;
                    divNuget.append(img);
                    badgesContainer.appendChild(divNuget);
                });
            }

            return card;
        } catch (error) {
            app.onError(error, 'Failed to create project card');
            return null;
        }
    }

    function showProject(index) {
        try {
            if (index < 0 || index >= projects.length) {
                return;
            }

            // Update buttons
            const buttons = projectList.querySelectorAll('.gh-projects-carousel-project-select-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            buttons[index].classList.add('active');

            // Update dots (for mobile view)
            const dots = dotsContainer.querySelectorAll('.gh-projects-carousel-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');

            const newCard = createProjectCard(projects[index]);
            if (!newCard) return;

            const existingCard = projectDetails.querySelector('.gh-projects-carousel-project-card');
            if (existingCard) {
                existingCard.remove();
            }

            projectDetails.appendChild(newCard);
        } catch (error) {
            app.onError(error, 'Failed to show project');
        }
    }

    function setupEventListeners() {
        try {
            // Project buttons
            projectList.addEventListener('click', handleProjectClick);

            // Dots (for mobile view)
            dotsContainer.addEventListener('click', handleDotClick);
        } catch (error) {
            app.onError(error, 'Failed to setup event listeners');
        }
    }

    function handleProjectClick(event) {
        try {
            const button = event.target.closest('.gh-projects-carousel-project-select-btn');

            if (button) {
                const index = parseInt(button.dataset.index);
                showProject(index);
            }
        } catch (error) {
            app.onError(error, 'Failed to handle project click');
        }
    }

    function handleDotClick(event) {
        try {
            const dot = event.target.closest('.gh-projects-carousel-dot');

            if (dot) {
                const index = parseInt(dot.dataset.index);
                showProject(index);
            }
        } catch (error) {
            app.onError(error, 'Failed to handle dot click');
        }
    }

    // ===== Initialization =======================================================

    async function init() {
        try {
            loadProjects();
            setupEventListeners();
            showProject(0);
        } catch (error) {
            app.onError(error, 'Failed to initialize carousel');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();