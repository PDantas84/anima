import React from 'react';
import { router } from 'expo-router';
import { Leaf } from 'lucide-react';
import { EmptyState } from '@/web/components/UI';
export default function NotFound() {
  return (
    <EmptyState
      icon={<Leaf size={32} />}
      title="Vamos voltar ao seu espaço?"
      description="Este caminho não foi encontrado. Seu refúgio continua aqui."
      action={
        <button className="button primary" onClick={() => router.replace('/')}>
          Voltar ao início
        </button>
      }
    />
  );
}
