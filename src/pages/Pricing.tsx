/**
 * Pricing Page
 * 
 * Subscription plans and pricing information for Aurion Studio.
 */

import React, { useState } from 'react';
import { Check, X, Zap, Shield, Crown, Rocket } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PricingFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  icon: React.ElementType;
  features: PricingFeature[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'primary' | 'premium';
}

// =============================================================================
// PRICING PLANS DATA
// =============================================================================

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Pour démarrer et explorer la plateforme',
    price: {
      monthly: 0,
      yearly: 0,
    },
    icon: Zap,
    buttonText: 'Commencer Gratuitement',
    buttonVariant: 'default',
    features: [
      { name: '3 projets actifs', included: true },
      { name: '1 Go de stockage', included: true },
      { name: 'Code Editor basique', included: true },
      { name: 'Text Editor', included: true },
      { name: 'Support communautaire', included: true },
      { name: 'Agent AI', included: false },
      { name: 'App Builder', included: false },
      { name: 'Workflow Automation', included: false },
      { name: 'Monitoring Dashboard', included: false },
      { name: 'Support prioritaire', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'Idéal pour les développeurs individuels',
    price: {
      monthly: 19,
      yearly: 190,
    },
    icon: Shield,
    buttonText: 'Essai Gratuit 14 jours',
    buttonVariant: 'primary',
    features: [
      { name: '10 projets actifs', included: true },
      { name: '10 Go de stockage', included: true },
      { name: 'Code Editor complet', included: true },
      { name: 'Text Editor', included: true },
      { name: 'Agent AI', included: true, limit: '100 requêtes/mois' },
      { name: 'App Builder basique', included: true },
      { name: 'Workflow Automation', included: false },
      { name: 'Monitoring Dashboard', included: false },
      { name: 'Support email', included: true },
      { name: 'API Access', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les équipes et professionnels',
    price: {
      monthly: 49,
      yearly: 490,
    },
    icon: Crown,
    popular: true,
    buttonText: 'Essai Gratuit 14 jours',
    buttonVariant: 'premium',
    features: [
      { name: 'Projets illimités', included: true },
      { name: '100 Go de stockage', included: true },
      { name: 'Code Editor complet', included: true },
      { name: 'Text Editor avancé', included: true },
      { name: 'Agent AI', included: true, limit: '1000 requêtes/mois' },
      { name: 'App Builder complet', included: true },
      { name: 'Workflow Automation', included: true },
      { name: 'Monitoring Dashboard', included: true },
      { name: 'Support prioritaire 24/7', included: true },
      { name: 'API Access complet', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solutions sur-mesure pour grandes entreprises',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    icon: Rocket,
    buttonText: 'Contacter les Ventes',
    buttonVariant: 'default',
    features: [
      { name: 'Projets illimités', included: true },
      { name: 'Stockage illimité', included: true },
      { name: 'Tous les outils premium', included: true },
      { name: 'Agent AI illimité', included: true },
      { name: 'Workflow Automation avancé', included: true },
      { name: 'Monitoring multi-tenant', included: true },
      { name: 'SSO / SAML', included: true },
      { name: 'SLA garanti 99.9%', included: true },
      { name: 'Account Manager dédié', included: true },
      { name: 'Déploiement on-premise', included: true },
    ],
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const PricingCard: React.FC<{ plan: PricingPlan; isYearly: boolean }> = ({ plan, isYearly }) => {
  const Icon = plan.icon;
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const period = isYearly ? '/an' : '/mois';
  
  const buttonClasses = {
    default: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    premium: 'bg-gradient-to-r from-[#D4FF00] to-[#B8E600] hover:from-[#E5FF4D] hover:to-[#C9F000] text-black font-semibold',
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 ${
        plan.popular
          ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-[#D4FF00] shadow-lg shadow-[#D4FF00]/10'
          : 'bg-zinc-900 border border-zinc-800'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#D4FF00] text-black text-xs font-bold px-3 py-1 rounded-full">
            POPULAIRE
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${plan.popular ? 'bg-[#D4FF00]/20' : 'bg-zinc-800'}`}>
          <Icon className={`w-6 h-6 ${plan.popular ? 'text-[#D4FF00]' : 'text-zinc-400'}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <p className="text-sm text-zinc-400">{plan.description}</p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">
            {price === 0 ? 'Gratuit' : `€${price}`}
          </span>
          {price > 0 && <span className="text-zinc-400">{period}</span>}
        </div>
        {isYearly && price > 0 && (
          <p className="text-sm text-emerald-400 mt-1">
            Économisez {Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)}%
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 px-4 rounded-lg transition-all duration-200 mb-6 ${buttonClasses[plan.buttonVariant]}`}
      >
        {plan.buttonText}
      </button>

      {/* Features */}
      <div className="space-y-3 flex-1">
        <p className="text-sm font-medium text-zinc-300">Inclus:</p>
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? 'text-zinc-300' : 'text-zinc-500'}>
              {feature.name}
              {feature.limit && (
                <span className="text-xs text-zinc-500 ml-1">({feature.limit})</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="pt-16 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Plans d'<span className="text-[#D4FF00]">Abonnement</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Choisissez le plan qui correspond à vos besoins. Tous les plans incluent un accès
          à notre plateforme de développement et à nos outils de base.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !isYearly ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              isYearly ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Annuel
            <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-zinc-900/50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions Fréquentes</h2>
          
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-zinc-400 text-sm">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements
                prennent effet immédiatement et sont proratisés.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">
                Y a-t-il une période d'essai ?
              </h3>
              <p className="text-zinc-400 text-sm">
                Les plans Starter et Pro incluent un essai gratuit de 14 jours. Aucune carte
                de crédit n'est requise pour commencer.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-zinc-400 text-sm">
                Nous acceptons toutes les cartes de crédit principales (Visa, Mastercard, Amex),
                PayPal, et les virements bancaires pour les plans Enterprise.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-2">
                Qu'est-ce qui est inclus dans le support Enterprise ?
              </h3>
              <p className="text-zinc-400 text-sm">
                Le plan Enterprise inclut un Account Manager dédié, support 24/7, SLA garanti,
                formations personnalisées, et accès prioritaire aux nouvelles fonctionnalités.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Vous avez des questions ?
        </h2>
        <p className="text-zinc-400 mb-6">
          Notre équipe est là pour vous aider à choisir le plan qui vous convient.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-[#D4FF00] text-black font-semibold rounded-lg hover:bg-[#E5FF4D] transition-colors">
            Contacter les Ventes
          </button>
          <button className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700">
            Voir la Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
