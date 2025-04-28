const ENV = "production"; // changeable facilement

const config = {
    development: {
        FRONTEND_URL: "http://localhost:5173",
        TIERS_URL: "http://localhost:8300"
    },
    production: {
        FRONTEND_URL: "https://secugram.web.app",
        TIERS_URL_RENDER: "https://tiers-de-confiance.onrender.com",
        TIERS_URL: "https://tiers-de-confiance-production.up.railway.app"
    }
};

export const { FRONTEND_URL, TIERS_URL } = config[ENV];
