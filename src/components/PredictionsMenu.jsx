
import React from 'react';

import { TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PredictionsMenu = () => {
  const pathname = usePathname();
  const currentPath = pathname;

  return (
    <Link
      href="/predictions"
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        currentPath === '/predictions'
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      <TrendingUp className="h-4 w-4 mr-2" />
      Predictions
    </Link>
  );
};

export default PredictionsMenu;
