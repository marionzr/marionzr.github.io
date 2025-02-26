(function () { // IIFE

    const app = globalThis.app;

    // TODO: Move this to an external source
    // type can be: related, previous or next
    const RELATED_ARTICLES = {
        articleLinks: [
            {
                href: "bootstrapping-dotnet-projects.html",
                links: [
                    {
                        icon: "related",
                        title: "Must-Have Visual Studio Extensions",
                        href: "must-have-visual-studio-extensions.html",
                    },
                    {
                        icon: "next",
                        title: "Scaffolding: Create a .NET solution like a pro",
                        href: "scaffolding-initializing-a-dotnet-solution-like-a-pro.html",
                    }
                ]
            },
            {
                href: "scaffolding-initializing-a-dotnet-solution-like-a-pro.html",
                links: [
                    {
                        icon: "previous",
                        title: "Bootstrapping .NET projects",
                        href: "bootstrapping-dotnet-projects.html",
                    },
                    {
                        icon: "next",
                        title: "Build and Test with GitHub Actions",
                        href: "build-and-test-with-github-actions.html",
                    }
                ]
            },
            {
                href: "build-and-test-with-github-actions.html",
                links: [
                    {
                        icon: "previous",
                        title: "Scaffolding: Create a .NET solution like a pro",
                        href: "scaffolding-initializing-a-dotnet-solution-like-a-pro.html",
                    },
                    {
                        icon: "next",
                        title: "Analyze: Integrating SonarQube for better code quality",
                        href: "analyze-integrating-sonarqube-for-better-code-quality.html",
                    }
                ]
            },
            {
                href: "analyze-integrating-sonarqube-for-better-code-quality.html",
                links: [
                    {
                        icon: "previous",
                        title: "Build and Test with GitHub Actions",
                        href: "build-and-test-with-github-actions.html",
                    },
                    {
                        icon: "next",
                        title: "Automating Dependency Management with Dependabot",
                        href: "automating-dependency-management-with-dependabot.html",
                    }
                ]
            },
            {
                href: "automating-dependency-management-with-dependabot.html",
                links: [
                    {
                        icon: "previous",
                        title: "Analyze: Integrating SonarQube for better code quality",
                        href: "analyze-integrating-sonarqube-for-better-code-quality.html",
                    },
                    {
                        icon: "previous",
                        title: "Containerizing with Docker",
                        href: "containerizing-with-docker.html",
                    }
                ]
            },
            {
                href: "containerizing-with-docker.html",
                links: [
                    {
                        icon: "previous",
                        title: "Automating Dependency Management with Dependabot",
                        href: "automating-dependency-management-with-dependabot.html",
                    },
                    {
                        icon: "previous",
                        title: "Automating Docker Image Deployments",
                        href: "automating-docker-image-deployments.html",
                    }
                ]
            },
            {
                href: "automating-docker-image-deployments.html",
                links: [
                    {
                        icon: "previous",
                        title: "Containerizing with Docker",
                        href: "containerizing-with-docker.html",
                    }
                ]
            },
            {
                href: "building-high-performing-teams-lessons-from-a-tech-lead.html",
                links: [
                    {
                        icon: "related",
                        title: "Hiring Developers: You're Doing It Wrong!",
                        href: "hiring-developers-you-are-doing-it-wrong.html",
                    }
                ]
            },
            {
                href: "hiring-developers-you-are-doing-it-wrong.html",
                links: [
                    {
                        icon: "related",
                        title: "Building High-Performing Teams: Lessons from a Tech Lead",
                        href: "building-high-performing-teams-lessons-from-a-tech-lead.html",
                    }
                ]
            }
        ]
    };

    function createCard(article) {
        if (!article) return null;

        const link = document.createElement('a');
        link.className = 'related-article-card';
        link.href = article.href;
        if (article.target) {
            link.setAttribute('target', article.target);
        }

        const title = document.createElement('div');
        title.className = 'related-article-title';
        title.textContent = article.title;

        const icon = document.createElement('i');
        icon.classList.add('related-article-chevron', 'fa');
        switch (article.icon) {
            case 'previous':
                icon.classList.add('fa-arrow-alt-circle-left');
                break;
            case 'next':
                icon.classList.add('fa-arrow-alt-circle-right');
                break;
            case 'related':
                icon.classList.add('fa-link');
                break;
        }

        link.appendChild(icon);
        link.appendChild(title);

        return link;
    }

    function findCurrentArticle() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        return RELATED_ARTICLES.articleLinks.find(article => fileName === article.href);
    }

    function addRelatedContentLinks() {
        const relatedContent = document.querySelector('related-content');

        if (!relatedContent) {
            return;
        }

        const currentArticle = findCurrentArticle();

        if (!currentArticle?.links) {
            return;
        }

        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'related-articles-section-title';
        sectionTitle.textContent = 'Related Articles';
        relatedContent.appendChild(sectionTitle);

        const relatedArticlesContainer = document.createElement('div');
        relatedArticlesContainer.className = 'related-articles-container';

        currentArticle.links.forEach(link => {
            const card = createCard(link);
            if (card) {
                relatedArticlesContainer.appendChild(card);
            }
        });

        relatedContent.appendChild(relatedArticlesContainer);
    }

    // ==== Initialization ========================================================
    function init() {
        try {
            addRelatedContentLinks();
        } catch (error) {
            app.onError(error, 'Error in nzrArticleRelatedContentInitialize');
        }
    }

    document.addEventListener('DOMContentLoaded', init);

})();
