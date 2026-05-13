// Audit logger — records sensitive user and admin actions with timestamp, IP, and user identity.
// This creates a structured audit trail for security review.

const auditLog = (action) => {
    return (req, res, next) => {
        const userId = req.session?.userId || 'unauthenticated';
        const userRole = req.session?.userRole || 'none';
        const ip = req.ip || req.connection.remoteAddress;
        const timestamp = new Date().toISOString();

        console.log(
            `[AUDIT] ${timestamp} | action=${action} | userId=${userId} | role=${userRole} | ip=${ip} | path=${req.originalUrl}`
        );

        next();
    };
};

module.exports = { auditLog };
