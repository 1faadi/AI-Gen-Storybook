import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100">
      {/* Header */}
      <header className="p-6 text-center">
        <h1
          className="text-6xl md:text-8xl font-bold text-primary animate-bounce-gentle"
          style={{ fontFamily: "var(--font-fredoka)" }}
        >
          ✨ Magic Storybook ✨
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-secondary mt-4">{"Create Your Child's Amazing Adventure!"}</p>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="text-8xl mb-8 animate-wiggle">📚</div>
          <h2
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Create Customized Story Book
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-primary mb-8 text-balance">
            Add Your Child in the Story Book!
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto text-pretty">
            {
              "Upload your little one's photo and watch them become the hero of magical adventures! Choose from jungle expeditions, superhero missions, princess tales, and more!"
            }
          </p>

          <Link href="/create">
            <Button
              size="lg"
              className="text-2xl md:text-3xl font-bold py-8 px-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎨 Start Creating Magic! 🎨
            </Button>
          </Link>
        </div>

        {/* Story Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-4 border-primary rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">🦁</div>
              <h3 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                Jungle Adventure
              </h3>
              <p className="text-xl text-card-foreground">
                {"Explore wild jungles with lions, elephants, and monkeys!"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-secondary rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 animate-wiggle">🦸‍♂️</div>
              <h3 className="text-3xl font-bold text-secondary mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                Superhero Tales
              </h3>
              <p className="text-xl text-card-foreground">
                {"Become Superman, Spiderman, or Batman and save the day!"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-4 border-pink-500 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">👸</div>
              <h3 className="text-3xl font-bold text-pink-500 mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                Princess Stories
              </h3>
              <p className="text-xl text-card-foreground">
                {"Magical princess adventures with castles and fairy tales!"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-card rounded-3xl p-12 border-4 border-primary shadow-xl mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-center text-primary mb-12"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            How It Works! 🎉
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce-gentle">📸</div>
              <h3 className="text-2xl font-bold text-secondary mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                1. Upload Photo
              </h3>
              <p className="text-xl text-card-foreground">{"Upload your child's favorite photo"}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6 animate-wiggle">🎨</div>
              <h3 className="text-2xl font-bold text-secondary mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                2. Choose Adventure
              </h3>
              <p className="text-xl text-card-foreground">{"Pick from amazing story themes"}</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce-gentle">📖</div>
              <h3 className="text-2xl font-bold text-secondary mb-4" style={{ fontFamily: "var(--font-fredoka)" }}>
                3. Get Your Book
              </h3>
              <p className="text-xl text-card-foreground">{"Receive your magical storybook in 1 hour!"}</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="text-8xl mb-8 animate-wiggle">🌟</div>
          <h2
            className="text-4xl md:text-5xl font-bold text-primary mb-8"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Ready for Adventure?
          </h2>
          <p className="text-2xl text-muted-foreground mb-8">
            {"Only $10 for a personalized storybook delivered to your email!"}
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="text-3xl font-bold py-8 px-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Create My Story Now! 🚀
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground p-8 mt-16">
        <div className="container mx-auto text-center">
          <div className="text-4xl mb-4 animate-bounce-gentle">🎪</div>
          <p className="text-xl font-bold mb-4">{"Making magical memories, one story at a time!"}</p>
          <p className="text-lg">{"Questions? We're here to help create your child's perfect adventure!"}</p>
        </div>
      </footer>
    </div>
  )
}
