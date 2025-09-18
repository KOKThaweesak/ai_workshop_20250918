package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Initialize database
	InitDB()

	// Serve login page at root
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendFile("./static/login.html")
	})

	// Health endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	app.Post("/register", Register)
	app.Post("/login", Login)
	app.Get("/protected", JWTMiddleware(), Protected)

	// Serve static test pages and swagger
	app.Static("/static", "./static")
	app.Get("/swagger.json", func(c *fiber.Ctx) error { return c.SendFile("./swagger.json") })

	app.Listen(":3000")
}
