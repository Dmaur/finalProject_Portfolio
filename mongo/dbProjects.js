db.projects.drop();

db.projects.insert([
    {
        "projName": "Personal links landing page",
        "description": "A personal links launch pad for your browser. Has an admin end with login for managing links and categories.",
        "imgSrc": "/image/LinksApp.png",
        "link": "https://github.com/Dmaur/LinksApp",
        "tech":[
            {"techName": "ASP.NET Core"},
            {"techName": "MySQL"},
            {"techName": "C#"},
            {"techName": "Bootstrap"},
            {"techName": "Docker"}

        ]
    },
    {
        "projName": "Hover Draw",
        "description": "A simple browser based app that taught me the fundamentals of DOM manipulation and taking user input to control what is displayed. It's a fun one to look back on",
        "imgSrc": "/image/drawpad.png",
        "link": "https://dmaur.github.io/drawPadv2/",
        "tech":[
            {"techName": "HTML"},
            {"techName": "CSS"},
            {"techName": "JS"},

        ]
    },
    {
        "projName": "Technology Roster",
        "description": "This App is a mock up of an administration application built for the purpose of learning RESTful API's and non relational database management with MONGO. Here, I also learned page routing and user input validation/sanitization",
        "imgSrc": "/image/techroster.png",
        "link": "https://www.chefknivestogo.com",
        "tech":[
            {"techName": "React/Next.js"},
            {"techName": "MongoDB"},
            {"techName": "TypeScript"},
            {"techName": "TailWind"},
            {"techName": "Docker"}

        ]
    }


])