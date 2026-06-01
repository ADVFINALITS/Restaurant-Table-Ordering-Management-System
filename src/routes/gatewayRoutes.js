const express = require("express");

const {
    createProxyMiddleware
} = require("http-proxy-middleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
    AUTH_SERVICE,
    ORDER_SERVICE,
    PAYMENT_SERVICE,
    KITCHEN_SERVICE,
    NOTIFICATION_SERVICE
} = require("../config/services");

const router = express.Router();

/*
AUTH ROUTES
*/
router.use(
    "/auth",
    createProxyMiddleware({
        target: AUTH_SERVICE,
        changeOrigin: true
    })
);

/*
ORDER ROUTES
*/
router.use(
    "/orders",
    authMiddleware,
    createProxyMiddleware({
        target: ORDER_SERVICE,
        changeOrigin: true
    })
);

/*
PAYMENT ROUTES
*/
router.use(
    "/payments",
    authMiddleware,
    createProxyMiddleware({
        target: PAYMENT_SERVICE,
        changeOrigin: true
    })
);

/*
KITCHEN ROUTES
*/
router.use(
    "/kitchen",
    authMiddleware,
    createProxyMiddleware({
        target: KITCHEN_SERVICE,
        changeOrigin: true
    })
);

/*
NOTIFICATION ROUTES
*/
router.use(
    "/notifications",
    authMiddleware,
    createProxyMiddleware({
        target: NOTIFICATION_SERVICE,
        changeOrigin: true
    })
);

module.exports = router;