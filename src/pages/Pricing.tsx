/**
 * Pricing Page - Aurion Studio
 * 
 * SEO Keywords: tarifs Aurion Studio, prix abonnement SaaS, plans développeurs,
 * outils IA prix, comparatif abonnements, offre entreprise
 * 
 * Optimisé pour la conversion avec ancrage prix, urgence et preuve sociale.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Zap, Shield, Crown, Rocket, ArrowRight, Star, Users, Clock, MessageCircle } from 'lucide-react';
import { SEO, seoConfigs } from '@/components/common/SEO';

// =============================================================================
// TYPES
// =============================================================================

interface PricingFeature {
  name: string;
  included: boolean;
  limit?: string;
  highlight?: boolean;
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
  badge?: string;
}

// =============================================================================
// PRICING PLANS DATA - Avec copywriting conversion
// =============================================================================

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Parfait pour tester la plateforme',
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
    description: 'Pour les développeurs indépendants',
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
      { name: 'Text Editor avancé', included: true },
      { name: 'Agent AI', included: true, limit: '100 requêtes/mois', highlight: true },
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
    description: 'Le plus populaire — pour équipes ambitieuses',
    price: {
      monthly: 49,
      yearly: 490,
    },
    icon: Crown,
    popular: true,
    badge: '🔥 -60% vs. concurrence',
    buttonText: 'Essai Gratuit 14 jours',
    buttonVariant: 'premium',
    features: [
      { name: 'Projets illimités', included: true, highlight: true },
      { name: '100 Go de stockage', included: true },
      { name: 'Code Editor complet', included: true },
      { name: 'Text Editor avancé', included: true },
      { name: 'Agent AI', included: true, limit: '1000 requêtes/mois', highlight: true },
      { name: 'App Builder complet', included: true },
      { name: 'Workflow Automation', included: true, highlight: true },
      { name: 'Monitoring Dashboard', included: true },
      { name: 'Support prioritaire 24/7', included: true },
      { name: 'API Access complet', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Sur-mesure pour grandes organisations',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    icon: Rocket,
    buttonText: 'Contacter les Ventes',
    buttonVariant: 'default',
    badge: 'SLA 99.9%',
    features: [
      { name: 'Projets illimités', included: true },
      { name: 'Stockage illimité', included: true, highlight: true },
      { name: 'Tous les outils premium', included: true },
      { name: 'Agent AI illimité', included: true, highlight: true },
      { name: 'Workflow Automation avancé', included: true },
      { name: 'Monitoring multi-tenant', included: true },
      { name: 'SSO / SAML', included: true, highlight: true },
      { name: 'SLA garanti 99.9%', included: true },
      { name: 'Account Manager dédié', included: true },
      { name: 'Déploiement on-premise', included: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui ! Vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont proratisés au jour près. Aucun frais caché."
  },
  {
    question: "Y a-t-il une période d'essai gratuite ?",
    answer: "Les plans Starter et Pro incluent un essai gratuit de 14 jours avec toutes les fonctionnalités. Aucune carte de crédit requise pour commencer. Annulez à tout moment."
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons Visa, Mastercard, American Express, et PayPal. Pour les plans Enterprise, nous proposons également le virement bancaire et les factures personnalisées."
  },
  {
    question: "Que se passe-t-il si je dépasse mes limites ?",
    answer: "Nous vous prévenons à 80% d'utilisation. Si vous dépassez, votre service continue mais nous vous recommanderons de passer au plan supérieur. Pas de facturation surprise."
  },
  {
    question: "Puis-je annuler mon abonnement ?",
    answer: "Bien sûr ! Annulez en 1 clic depuis votre dashboard. Vous gardez l'accès jusqu'à la fin de votre période payée. Vos données sont conservées 30 jours après annulation."
  },
  {
    question: "Proposez-vous des réductions pour startups ou étudiants ?",
    answer: "Oui ! -50% pour les startups early-stage (<$1M levés) et -80% pour les étudiants. Contactez-nous avec votre justificatif."
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const PricingCard: React.FC<{ plan: PricingPlan; isYearly: boolean }> = ({ plan, isYearly }) => {
  const Icon = plan.icon;
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const monthlyEquivalent = isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
  const period = isYearly ? '/an' : '/mois';
  
  const buttonClasses = {
    default: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    premium: 'bg-gradient-to-r from-[#D4FF00] to-[#B8E600] hover:from-[#E5FF4D] hover:to-[#C9F000] text-black font-semibold shadow-lg shadow-[#D4FF00]/20',
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 ${
        plan.popular
          ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 border-2 border-[#D4FF00] shadow-xl shadow-[#D4FF00]/10 scale-105'
          : 'bg-zinc-900 border border-zinc-800'
      }`}
    >
      {/* Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#D4FF00] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            ⭐ LE PLUS POPULAIRE
          </span>
        </div>
      )}
      {plan.badge && !plan.popular && (
        <div className="absolute -top-3 right-4">
          <span className="bg-zinc-700 text-white text-xs font-medium px-3 py-1 rounded-full">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-xl ${plan.popular ? 'bg-[#D4FF00]/20' : 'bg-zinc-800'}`}>
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
            {price === 0 ? 'Gratuit' : `€${isYearly ? monthlyEquivalent : price}`}
          </span>
          {price > 0 && <span className="text-zinc-400">/mois</span>}
        </div>
        {isYearly && price > 0 && (
          <div className="mt-1">
            <span className="text-sm text-emerald-400 font-medium">
              ✓ Économisez €{plan.price.monthly * 12 - plan.price.yearly}/an
            </span>
            <span className="text-xs text-zinc-500 ml-2">
              (facturé €{plan.price.yearly}/an)
            </span>
          </div>
        )}
        {price === 0 && (
          <p className="text-sm text-zinc-500 mt-1">Pour toujours • Aucune CB requise</p>
        )}
      </div>

      {/* CTA Button */}
      <Link
        to={plan.id === 'enterprise' ? '/contact' : '/sign-up'}
        className={`w-full py-3.5 px-4 rounded-xl transition-all duration-200 mb-6 text-center block ${buttonClasses[plan.buttonVariant]}`}
      >
        {plan.buttonText}
        {plan.buttonVariant === 'premium' && <ArrowRight className="inline w-4 h-4 ml-2" />}
      </Link>

      {/* Features */}
      <div className="space-y-3 flex-1">
        <p className="text-sm font-medium text-zinc-300 mb-3">Ce qui est inclus :</p>
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${feature.highlight ? 'text-[#D4FF00]' : 'text-emerald-400'}`} />
            ) : (
              <X className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
            )}
            <span className={`${feature.included ? (feature.highlight ? 'text-white font-medium' : 'text-zinc-300') : 'text-zinc-500'}`}>
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
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* SEO Component */}
      <SEO {...seoConfigs.pricing} />
      
      {/* SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "PriceSpecification",
        "name": "Aurion Studio Pricing",
        "description": "Plans d'abonnement Aurion Studio - De gratuit à Enterprise",
        "priceCurrency": "EUR"
      })}} />

      {/* Header */}
      <div className="pt-16 pb-12 px-4 text-center">
        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 border-2 border-[#0d0d0d]" />
            ))}
          </div>
          <span className="text-sm text-zinc-400 ml-2">
            Rejoint par <strong className="text-white">50 000+</strong> développeurs
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Des tarifs <span className="text-[#D4FF00]">transparents</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-4">
          Tous les outils dont vous avez besoin, à un prix juste.
          <strong className="text-white"> Pas de frais cachés, pas de surprises.</strong>
        </p>
        
        {/* Guarantee Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-400 mb-8">
          <Shield className="w-4 h-4" />
          Garantie satisfait ou remboursé 30 jours
        </div>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              !isYearly ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              isYearly ? 'bg-[#D4FF00] text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Annuel
            <span className={`text-xs px-2 py-0.5 rounded-full ${isYearly ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-400'}`}>
              2 mois offerts
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-y border-zinc-800 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 text-zinc-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Chiffrement AES-256</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-sm">Conforme RGPD</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">4.9/5 sur Trustpilot</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">50 000+ utilisateurs</span>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-zinc-900/50 py-16 px-4" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Questions fréquentes</h2>
          <p className="text-center text-zinc-400 mb-10">
            Tout ce que vous devez savoir avant de commencer.
          </p>
          
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                <h3 className="font-semibold text-white mb-3 flex items-start gap-3">
                  <span className="text-[#D4FF00]">Q:</span>
                  {item.question}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-[#D4FF00]/10 text-[#D4FF00] text-sm font-medium rounded-full mb-6">
            🎁 Offre limitée : -20% supplémentaire avec le code LAUNCH2026
          </span>
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre workflow ?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Rejoignez les milliers de développeurs qui gagnent du temps chaque jour.
            <br />
            <strong className="text-white">Essai gratuit 14 jours, aucune CB requise.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/sign-up"
              className="px-8 py-4 bg-[#D4FF00] text-black font-semibold rounded-xl hover:bg-[#E5FF4D] transition-colors shadow-lg shadow-[#D4FF00]/20"
            >
              Commencer Gratuitement →
            </Link>
            <Link 
              to="/contact"
              className="px-8 py-4 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Parler à un Expert
            </Link>
          </div>
          <p className="text-sm text-zinc-500 mt-6">
            Vous avez des questions ? <Link to="/contact" className="text-[#D4FF00] hover:underline">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
