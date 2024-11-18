"use client"

import { Button } from "../components/ui/button"
import { Database, Activity, BarChart3, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FeatureCard } from "./FeatureCard"
import { HomePageProps } from "../types"

export const HomePageUI: React.FC<HomePageProps> = ({
  handleSignIn,
  handleSignUp,
  isLoading,
  error
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Image
            src="/logo.svg"
            alt="DeeperEdge"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="font-bold text-[#000000] text-xl">DeeperEdge</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-custom">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionizing Movement Analysis with M3A Technology
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Movement is Life.
                </p>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  DeeperEdge&apos;s advanced movement classification platform is transforming sports and healthcare through precise data collection and expert analysis.
                </p>
              </div>
              <div className="space-x-4">
                <Button 
                  className="bg-white text-[#604abd] hover:bg-gray-100"
                  onClick={() => handleSignIn()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
                <Button 
                  className="bg-white text-[#604abd] hover:bg-gray-100"
                  onClick={() => handleSignUp()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </div>
              {error && <p className="text-red-200">{error}</p>}
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 text-[#000000]">
              Our Cutting-Edge Features
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <FeatureCard
                icon={<Database className="h-10 w-10 mb-4 text-[#604abd]" />}
                title="Data Collection & Sync"
                description="Synchronize video, audio, and 126 sensor channels with unparalleled precision. Capture movement windows with pinpoint accuracy for comprehensive analysis."
              />
              <FeatureCard
                icon={<Activity className="h-10 w-10 mb-4 text-[#604abd]" />}
                title="Expert Rating System"
                description="Utilize our advanced step classification and rating capabilities. Customize rating templates to fit your specific needs and focus on quality assessment."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 mb-4 text-[#604abd]" />}
                title="Validation & Analysis"
                description="Ensure data integrity with our rigorous quality control process. Train machine learning models and perform real-time analysis for immediate insights."
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12 text-[#000000]">
              Affiliated With
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <Image 
                src="/IMG_2869.jpg" 
                alt="Affiliations" 
                width={1000} 
                height={300} 
                className="max-w-full h-auto"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.png';
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 px-4 md:px-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DeeperEdge"
              width={32}
              height={32}
              className="mr-2"
            />
            <p className="text-sm text-gray-500">
              © 2024 DeeperEdge. All rights reserved.
            </p>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm text-gray-500 hover:text-[#604abd]" href="#terms">
              Terms
            </Link>
            <Link className="text-sm text-gray-500 hover:text-[#604abd]" href="#privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
} 