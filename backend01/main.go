package main

import (
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Initialize database
	InitDB()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "hello world"})
	})

	app.Post("/register", Register)
	app.Post("/login", Login)
	app.Get("/protected", JWTMiddleware(), Protected)

	// Serve static test pages and swagger
	app.Static("/static", "./static")
	app.Get("/swagger.json", func(c *fiber.Ctx) error { return c.SendFile("./swagger.json") })

	app.Listen(":3000")
}
