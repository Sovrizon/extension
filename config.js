const ENV = "production"; // changeable facilement

const config = {
    development: {
        FRONTEND_URL: "http://localhost:5173",
        TIERS_URL: "http://localhost:8300"
    },
    production: {
        FRONTEND_URL: "https://secugram.web.app",
        TIERS_URL: "https://tiers-de-confiance.onrender.com"
    }
};

export const { FRONTEND_URL, TIERS_URL } = config[ENV];