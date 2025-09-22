'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Board } from '@/components/Board';
import { Card } from '@/components/Card';
import { useTenantStore } from '@/store/tenantStore';
import { useBoardStore } from '@/store/boardStore';

export default function Dashboard() {
  const [activeCard, setActiveCard] = useState<any>(null);
  const { tenant, isLoading: tenantLoading } = useTenantStore();
  const { boards, lists, cards, fetchBoards, moveCard } = useBoardStore();

  useEffect(() => {
    if (tenant?.id) {
      fetchBoards();
    }
  }, [tenant?.id, fetchBoards]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find(c => c.id === active.id);
    setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const cardId = active.id as string;
    const newListId = over.id as string;
    
    moveCard(cardId, newListId);
    setActiveCard(null);
  };

  if (tenantLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to WorkFlowX</h1>
          <p className="text-gray-600 mb-8">Please select or create a tenant to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WorkFlowX</h1>
              <p className="text-sm text-gray-600">{tenant.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                New Board
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <Board
                key={board.id}
                board={board}
                lists={lists.filter(list => list.board_id === board.id)}
                cards={cards}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeCard ? <Card card={activeCard} isDragging /> : null}
          </DragOverlay>
        </DndContext>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first board to start organizing your projects.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                Create Your First Board
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}