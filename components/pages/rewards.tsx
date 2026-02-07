'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeaturedPartner {
  id: string
  name: string
  icon: string
  iconColor: string
  points: number
  description: string
}

interface Voucher {
  id: string
  name: string
  description: string
  icon: string
  points: number
}

const featuredPartners: FeaturedPartner[] = [
  {
    id: '1',
    name: 'Coffee House',
    icon: 'coffee',
    iconColor: 'text-green-700',
    points: 500,
    description: '$5 Gift Card'
  },
  {
    id: '2',
    name: 'Retailer Plus',
    icon: 'shopping_bag',
    iconColor: 'text-blue-600',
    points: 1200,
    description: '$10 Gift Card'
  },
  {
    id: '3',
    name: 'Cinema Pass',
    icon: 'theaters',
    iconColor: 'text-red-500',
    points: 1800,
    description: 'Movie Ticket'
  }
]

const vouchers: Voucher[] = [
  {
    id: '1',
    name: 'Ride Share Credit',
    description: '20% Discount Code',
    icon: 'local_taxi',
    points: 300
  },
  {
    id: '2',
    name: 'Food Delivery',
    description: 'Free Delivery Voucher',
    icon: 'lunch_dining',
    points: 150
  },
  {
    id: '3',
    name: 'Grocery Discount',
    description: '$2 Off Next Purchase',
    icon: 'garden_cart',
    points: 250
  },
  {
    id: '4',
    name: 'Streaming Month',
    description: 'Premium Subscription',
    icon: 'headphones',
    points: 2000
  }
]

export function Rewards() {
  const [availablePoints] = useState(2450)
  const [pointsToNextPerk] = useState(550)
  const [progressPercentage] = useState(75)

  const handleClaimVoucher = (voucherId: string, points: number) => {
    console.log('Claiming voucher:', voucherId, 'for', points, 'points')
    // Handle voucher claim logic
  }

  const handlePartnerClick = (partnerId: string) => {
    console.log('Partner clicked:', partnerId)
    // Handle partner navigation
  }

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-background-light dark:bg-background-dark pb-24">
      {/* Header with Points Card */}
      <header className="pt-14 px-6 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text-light dark:text-text-dark">
            Your Rewards
          </h1>
          <button className="size-10 rounded-full bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center border border-stone-200 dark:border-stone-700">
            <span className="material-symbols-outlined text-stone-600 dark:text-stone-400">
              history
            </span>
          </button>
        </div>

        {/* Points Card */}
        <Card className="p-6 relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute -right-4 -top-4 size-24 bg-primary/5 rounded-full blur-2xl"></div>
          
          <p className="text-stone-600 dark:text-stone-400 text-sm font-medium mb-1 relative z-10">
            Available Points
          </p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-4xl font-bold text-primary tracking-tight">
              {availablePoints.toLocaleString()}
            </span>
            <span className="text-lg font-bold text-primary/70">
              pts
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden relative z-10">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 relative z-10">
            {pointsToNextPerk} pts until your next Elite Perk
          </p>
        </Card>
      </header>

      {/* Featured Partners */}
      <section className="mb-8">
        <div className="px-6 mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-text-light dark:text-text-dark">
            Featured Partners
          </h2>
          <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
            See All
          </button>
        </div>

        {/* Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
          {featuredPartners.map((partner) => (
            <button
              key={partner.id}
              onClick={() => handlePartnerClick(partner.id)}
              className="flex-shrink-0 w-44 bg-white/60 dark:bg-stone-800/60 backdrop-blur-md rounded-[20px] p-4 shadow-sm border border-white/50 dark:border-stone-700/50 hover:shadow-md transition-all active:scale-95"
            >
              <div className="size-12 bg-white dark:bg-stone-700 rounded-xl shadow-sm mb-4 flex items-center justify-center">
                <span className={cn('material-symbols-outlined text-3xl', partner.iconColor)}>
                  {partner.icon}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1 text-text-light dark:text-text-dark text-left">
                {partner.name}
              </h3>
              <p className="text-primary font-bold text-base text-left">
                {partner.points} pts
              </p>
              <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-2 text-left">
                {partner.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Available Vouchers */}
      <section className="px-6 pb-24 flex-1">
        <h2 className="text-lg font-bold mb-4 text-text-light dark:text-text-dark">
          Available Vouchers
        </h2>

        <div className="space-y-3">
          {vouchers.map((voucher) => (
            <Card 
              key={voucher.id}
              className="p-4 flex items-center gap-4"
            >
              {/* Icon */}
              <div className="size-14 bg-background-light dark:bg-stone-700 rounded-xl flex items-center justify-center border border-stone-200 dark:border-stone-600">
                <span className="material-symbols-outlined text-primary text-xl">
                  {voucher.icon}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-bold text-sm text-text-light dark:text-text-dark">
                  {voucher.name}
                </h4>
                <p className="text-stone-600 dark:text-stone-400 text-xs">
                  {voucher.description}
                </p>
              </div>

              {/* Points & Claim */}
              <div className="text-right">
                <p className="text-primary font-bold text-sm">
                  {voucher.points} pts
                </p>
                <button 
                  onClick={() => handleClaimVoucher(voucher.id, voucher.points)}
                  className="text-[10px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider mt-1 hover:text-primary transition-colors"
                  disabled={availablePoints < voucher.points}
                >
                  {availablePoints >= voucher.points ? 'Claim' : 'Locked'}
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {vouchers.length === 0 && (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-stone-400 text-5xl mb-4 block">
              card_giftcard
            </span>
            <p className="text-stone-600 dark:text-stone-400 text-sm">
              No vouchers available at the moment
            </p>
            <p className="text-stone-500 dark:text-stone-500 text-xs mt-2">
              Check back soon for new rewards!
            </p>
          </div>
        )}
      </section>

      {/* Add custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}