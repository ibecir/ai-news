import React, { useState } from 'react';
import ModalComponent from '../components/common/ModalComponent';

const ModalTest: React.FC = () => {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isSmallOpen, setIsSmallOpen] = useState(false);
  const [isLargeOpen, setIsLargeOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNoTitleOpen, setIsNoTitleOpen] = useState(false);
  const [isLongContentOpen, setIsLongContentOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Modal Component Test Page</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setIsBasicOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Basic Modal (Medium)
          </button>

          <button
            onClick={() => setIsSmallOpen(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Open Small Modal
          </button>

          <button
            onClick={() => setIsLargeOpen(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Open Large Modal
          </button>

          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Open Form Modal
          </button>

          <button
            onClick={() => setIsNoTitleOpen(true)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Open Modal Without Title
          </button>

          <button
            onClick={() => setIsLongContentOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Open Modal with Long Content
          </button>
        </div>

        {/* Basic Modal */}
        <ModalComponent
          isOpen={isBasicOpen}
          onClose={() => setIsBasicOpen(false)}
          title="Basic Modal"
        >
          <p className="text-gray-600">
            This is a basic modal with default settings. It has a title, close button, and can be closed by clicking the backdrop or pressing ESC.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsBasicOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsBasicOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </ModalComponent>

        {/* Small Modal */}
        <ModalComponent
          isOpen={isSmallOpen}
          onClose={() => setIsSmallOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p className="text-gray-600">This is a small modal for simple confirmations or alerts.</p>
          <div className="mt-4">
            <button
              onClick={() => setIsSmallOpen(false)}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </ModalComponent>

        {/* Large Modal */}
        <ModalComponent
          isOpen={isLargeOpen}
          onClose={() => setIsLargeOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a large modal suitable for displaying more content or complex forms.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Feature 1</h3>
                <p className="text-sm text-gray-600">Description of feature 1</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Feature 2</h3>
                <p className="text-sm text-gray-600">Description of feature 2</p>
              </div>
            </div>
          </div>
        </ModalComponent>

        {/* Form Modal */}
        <ModalComponent
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="User Registration"
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message here..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </ModalComponent>

        {/* Modal Without Title */}
        <ModalComponent
          isOpen={isNoTitleOpen}
          onClose={() => setIsNoTitleOpen(false)}
          showCloseButton={true}
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Your action was completed successfully.</p>
          </div>
        </ModalComponent>

        {/* Long Content Modal */}
        <ModalComponent
          isOpen={isLongContentOpen}
          onClose={() => setIsLongContentOpen(false)}
          title="Terms and Conditions"
          size="lg"
        >
          <div className="space-y-4 text-gray-600">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
            <p>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <p>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </p>
            <p>
              Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setIsLongContentOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => setIsLongContentOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </ModalComponent>
      </div>
    </div>
  );
};

export default ModalTest;
