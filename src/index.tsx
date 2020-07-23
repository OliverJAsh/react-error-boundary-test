// https://reactjs.org/docs/error-boundaries.html

import * as React from 'react';
import { Component, ErrorInfo } from 'react';
import { render } from 'react-dom';

type Props = {};
type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
    state = { hasError: false };

    // We define this to silence a React warning.
    static getDerivedStateFromError(error: unknown) {
        console.log('getDerivedStateFromError', { error });

        return { hasError: true };
    }

    componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
        console.log('componentDidCatch', { error, errorInfo });
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

    return <div>INSIDE error boundary</div>;
};

const App = () => {
    console.log('App');

    const el = (
        <>
            <Boom prop={1} />
            <Inner />
        </>
    );
    return (
        <>
            <div>OUTSIDE error boundary</div>

            <ErrorBoundary>{el}</ErrorBoundary>
        </>
    );
};

render(<App />, document.getElementById('root'));
