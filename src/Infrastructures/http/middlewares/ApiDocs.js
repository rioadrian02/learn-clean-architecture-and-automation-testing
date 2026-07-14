import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file YAML dari folder docs
const swaggerDocument = YAML.load(
    path.join(__dirname, '../../../../docs/openapi.yaml')
);

const apiDocsMiddleware = [
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
];

export default apiDocsMiddleware;