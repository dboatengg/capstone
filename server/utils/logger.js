import winston from 'winston'

// Vercel's function filesystem is read-only, so production logs must go to
// stdout/stderr. Keep file transports for local development only.
const transports = [new winston.transports.Console()]

if (!process.env.VERCEL) {
    transports.push(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    )
}

const logger = winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports
})

export default logger;
