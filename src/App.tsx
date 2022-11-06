import './App.css';
import MonacoEditor from '@uiw/react-monacoeditor';
import data from './data.json';

function App() {
    return (
        <div className="App">
            <MonacoEditor
                language="json"
                value={JSON.stringify(data, null, '\t')}
                options={{
                    theme: 'vs-dark',
                    autoIndent: 'brackets',
                    copyWithSyntaxHighlighting: true,
                    fontLigatures: true,
                    fontSize: 14,
                    fontFamily: 'Operator Mono',
                    wordWrap: 'on',
                    wrappingIndent: 'deepIndent',
                    wrappingStrategy: 'advanced',
                    foldingStrategy: 'indentation',
                    matchBrackets: 'always',
                    fontWeight: '300',
                    readOnly: true,
                    detectIndentation: true,
                    minimap: {
                        enabled: false,
                    },
                }}
                height="100vh"
            />
        </div>
    );
}

export default App;
