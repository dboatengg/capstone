import winston from 'winston'

// Configure Winston logger with console and file transports
const logger = winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports:[
        new winston.transports.Console(),
        // Log errors to separate file
        new winston.transports.File({
            filename:'logs/error.log',
            level:'error'
        }),
        // Log all messages to combined file
        new winston.transports.File({
            filename:'logs/combined.log'
        })
    ]
})

export default logger;