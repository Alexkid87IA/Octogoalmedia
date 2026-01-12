// src/components/article/blocks/Callout.tsx
// Bloc Callout/Alerte - 6 types différents
import React from 'react';
import { Info, AlertTriangle, CheckCircle, Flame, BarChart3, MessageCircle } from 'lucide-react';
import { CalloutBlock } from '../../../types/sanity';

interface CalloutProps {
  value: CalloutBlock;
}

const calloutStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Info,
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    titleColor: 'text-amber-300',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: CheckCircle,
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
  breaking: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: Flame,
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
  stat: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: BarChart3,
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
  quote: {
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    icon: MessageCircle,
    iconColor: 'text-pink-400',
    titleColor: 'text-pink-300',
  },
};

const Callout: React.FC<CalloutProps> = ({ value }) => {
  const { type = 'info', title, content } = value;
  const style = calloutStyles[type] || calloutStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        my-8 rounded-xl border ${style.bg} ${style.border}
        overflow-hidden
      `}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Icône */}
        <div className={`flex-shrink-0 mt-0.5 ${style.iconColor}`}>
          <Icon size={24} />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-bold text-base mb-2 ${style.titleColor}`}>
              {title}
            </h4>
          )}
          <p className="text-gray-300 leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Callout;
