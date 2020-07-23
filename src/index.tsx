// https://reactjs.org/docs/error-boundaries.html

import * as React from 'react';
import { Component, ErrorInfo } from 'react';
import { render } from 'react-dom';

class ErrorBoundary extends Component<{}, { hasError: boolean }> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError(error: unknown) {
        console.log('getDerivedStateFromError', { error });

        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
        console.log('componentDidCatch', { error, errorInfo });

        // Already logged due to
        // https://github.com/facebook/react/issues/12897#issuecomment-410036991
        // console.error(error);
    }

    render() {
        // return this.state.hasError === false && this.props.children;
        return this.props.children;
    }
}

const Boom: React.FC<{ prop: number }> = ({ prop }) => {
    // When we throw, this renders twice
    // https://github.com/facebook/react/issues/16130
    console.log('Boom', { prop });

    throw new Error('boom');

    return null;
};

const Inner: React.FC = () => {
    console.log('Inner');

    return null;
};

//
// This fixes double logging
// https://github.com/facebook/react/issues/12897#issuecomment-410036991
//
// ❌
// window.onerror = (event) => {
//     console.log('now', event);

//     event !== undefined && event instanceof Event && event.preventDefault();
// };
// ✅
// window.addEventListener('error', (event) => {
//     event.preventDefault();
// });

const App = () => {
    console.log('App');

    const el = (
        <>
            <Boom prop={1} />
            <Boom prop={2} />
            <Inner />
        </>
    );
    return (
        <div>
            <div>outside</div>

            {/*
            No error boundary, logs twice
            https://github.com/facebook/react/issues/10384
            https://github.com/facebook/react/issues/10474
            */}
            {/* {el} */}

            {/*
            Error boundary, logs once
            */}
            <ErrorBoundary>{el}</ErrorBoundary>
        </div>
    );
};

render(<App />, document.getElementById('root'));

// render(<App />, document.getElementById('root'));
// render(<App />, document.getElementById('root'));
