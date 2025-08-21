import React from 'react';
import { Coffee, Thermometer, Timer, Heart } from 'lucide-react';

interface PreparationStep {
  amount: string;
  temperature: string;
  steepTime: string;
  taste: string;
}

interface TeaPreparationGuideProps {
  preparation: PreparationStep;
  productName: string;
}

const TeaPreparationGuide = ({ preparation, productName }: TeaPreparationGuideProps) => {
  const steps = [
    {
      icon: Coffee,
      title: 'How much',
      description: preparation.amount,
      detail: 'Perfect ratio for optimal flavor'
    },
    {
      icon: Thermometer,
      title: 'Temperature',
      description: preparation.temperature,
      detail: 'Ideal water temperature'
    },
    {
      icon: Timer,
      title: 'Infuse',
      description: preparation.steepTime,
      detail: 'Steeping time for best results'
    },
    {
      icon: Heart,
      title: 'Taste',
      description: preparation.taste,
      detail: 'Expected flavor profile'
    }
  ];

  return (
    <div className="bg-white border border-gray-100 p-6 mt-8">
      <h3 className="text-lg font-medium text-black mb-6 text-center">
        How to prepare {productName}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <h4 className="font-medium text-black text-sm mb-1">{step.title}</h4>
              <p className="text-sm text-primary font-medium mb-1">{step.description}</p>
              <p className="text-xs text-gray-500">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeaPreparationGuide;