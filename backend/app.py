import os
import json
import pickle
import logging
import time
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

os.environ['TRANSFORMERS_VERBOSITY'] = 'error'

# === FLASK APPLICATION SETUP ===
app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

tax_model = None
model_info = None


# === MODEL LOADING WITH FUNCTION SOURCE RECONSTRUCTION ===
def load_trained_model():
    global tax_model, model_info

    try:
        possible_paths = [
            'sri_lankan_tax_ai_model.pkl',
            'models/sri_lankan_tax_ai_model.pkl',
            '../sri_lankan_tax_ai_model.pkl',
            os.path.join(os.getcwd(), 'sri_lankan_tax_ai_model.pkl')
        ]

        model_path = None
        for path in possible_paths:
            if os.path.exists(path):
                model_path = path
                break

        if model_path is None:
            raise FileNotFoundError("Tax AI model file not found")

        logger.info(f"Found pickle file at: {model_path}")

        with open(model_path, 'rb') as f:
            tax_model = pickle.load(f)

        logger.info("Pickle loaded successfully")

        if 'function_sources' in tax_model:
            logger.info("New format detected - loading functions from source code")

            function_namespace = {}

            for func_name, source_code in tax_model['function_sources'].items():
                try:
                    exec(source_code, function_namespace)
                    logger.info(f"  Loaded function: {func_name}")
                except Exception as e:
                    logger.error(f"  Error loading function {func_name}: {e}")

            if 'generate_tax_response' in function_namespace:
                tax_model['generate_response'] = function_namespace['generate_tax_response']
                logger.info("Main generate_response function set successfully")
                has_trained_functions = True
            else:
                logger.error("generate_tax_response function not found in namespace")
                has_trained_functions = False

        else:
            logger.warning("Old format detected - function sources not available")
            has_trained_functions = False

        logger.info("Testing loaded model...")
        if 'generate_response' in tax_model and callable(tax_model['generate_response']):
            test_response = tax_model['generate_response']("What is VAT?", tax_model)
            logger.info(f"Model test successful: {test_response.get('answer', 'No answer')[:50]}...")
        else:
            logger.warning("Generate response function not available")
            tax_model['generate_response'] = create_basic_inference_function()
            test_response = tax_model['generate_response']("What is VAT?", tax_model)
            logger.info("Using basic inference function")

        model_info = {
            'model_info': tax_model.get('model_info', {}),
            'training_info': tax_model.get('training_info', {}),
            'device': 'GPU' if torch.cuda.is_available() else 'CPU',
            'pytorch_version': torch.__version__,
            'model_parameters': tax_model.get('training_info', {}).get('model_parameters', 222903552),
            'status': 'Loaded Successfully',
            'has_trained_functions': has_trained_functions,
            'function_sources_available': 'function_sources' in tax_model,
            'pickle_format': 'New (Function Sources)' if 'function_sources' in tax_model else 'Old (Direct References)'
        }

        logger.info(f"Model loaded successfully")
        logger.info(f"Has trained functions: {has_trained_functions}")
        logger.info(f"Function sources available: {'function_sources' in tax_model}")
        logger.info(f"Running on: {model_info['device']}")

        return True

    except Exception as e:
        logger.error(f"Failed to load trained model: {str(e)}")
        return False


def create_basic_inference_function():
    def generate_response(question, model_components):
        start_time = time.time()

        try:
            model = model_components.get('model')
            tokenizer = model_components.get('tokenizer')
            tokenizer_data = model_components.get('tokenizer_data')

            if tokenizer_data and not tokenizer:
                try:
                    import tempfile
                    from transformers import T5Tokenizer

                    with tempfile.TemporaryDirectory() as temp_dir:
                        for filename, content in tokenizer_data['files'].items():
                            file_path = os.path.join(temp_dir, filename)
                            if isinstance(content, bytes):
                                with open(file_path, 'wb') as f:
                                    f.write(content)
                            else:
                                with open(file_path, 'w', encoding='utf-8') as f:
                                    if isinstance(content, dict):
                                        json.dump(content, f)
                                    else:
                                        f.write(content)

                        tokenizer = T5Tokenizer.from_pretrained(temp_dir, legacy=False)
                        if tokenizer.pad_token is None:
                            tokenizer.pad_token = tokenizer.eos_token
                except Exception as e:
                    logger.error(f"Failed to reconstruct tokenizer: {e}")
                    tokenizer = None

            if not model or not tokenizer:
                return {
                    'title': 'Error',
                    'answer': 'Model components not available',
                    'keyPoints': [],
                    'confidence': 0.0,
                    'responseTime': time.time() - start_time
                }

            question = str(question).strip()
            if not question:
                return {
                    'title': 'Error',
                    'answer': 'Please provide a valid question',
                    'keyPoints': [],
                    'confidence': 0.0,
                    'responseTime': time.time() - start_time
                }

            tax_keywords = ['tax', 'vat', 'income', 'sri lanka', 'lankan', 'deduction', 'filing']
            if not any(keyword in question.lower() for keyword in tax_keywords):
                return {
                    'title': 'Not Tax Related',
                    'answer': 'I can only help with Sri Lankan tax questions. Please ask about VAT, income tax, deductions, or filing procedures.',
                    'keyPoints': ['Ask about VAT rates', 'Ask about income tax calculations',
                                  'Ask about tax filing procedures'],
                    'confidence': 1.0,
                    'responseTime': time.time() - start_time
                }

            input_text = f"answer sri lankan tax question: {question}"
            inputs = tokenizer(input_text, return_tensors="pt", max_length=256, truncation=True, padding=True)

            with torch.no_grad():
                outputs = model.generate(
                    inputs['input_ids'],
                    max_length=150,
                    num_beams=5,
                    do_sample=False,
                    early_stopping=True,
                    no_repeat_ngram_size=3
                )

            response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

            if response_text.lower().startswith("answer sri lankan tax question:"):
                response_text = response_text[31:].strip()

            if response_text and not response_text.endswith('.'):
                response_text += '.'

            return {
                'title': 'Sri Lankan Tax Information',
                'source': 'T5-based Tax AI',
                'answer': response_text or 'I can help with Sri Lankan tax questions.',
                'keyPoints': [response_text] if response_text else ['Ask specific tax questions'],
                'confidence': 0.8,
                'responseTime': time.time() - start_time,
                'metadata': {'recovered_from_pickle': True}
            }

        except Exception as e:
            return {
                'title': 'Error',
                'answer': f'Error processing question: {str(e)}',
                'keyPoints': [],
                'confidence': 0.0,
                'responseTime': time.time() - start_time
            }

    return generate_response


# === API ROUTES ===
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': tax_model is not None,
        'device': model_info.get('device', 'Unknown') if model_info else 'Unknown',
        'has_trained_functions': model_info.get('has_trained_functions', False) if model_info else False,
        'function_sources_available': model_info.get('function_sources_available', False) if model_info else False,
        'pickle_format': model_info.get('pickle_format', 'Unknown') if model_info else 'Unknown',
        'service': 'Sri Lankan Tax AI Assistant'
    })


@app.route('/metadata')
def get_metadata():
    if tax_model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    return jsonify({
        'model_info': model_info,
        'capabilities': {
            'tax_domains': ['VAT', 'Income Tax', 'Deductions', 'Filing Procedures'],
            'languages': ['English'],
            'country': 'Sri Lanka',
            'neural_network': True,
            'pickle_based': True,
            'function_reconstruction': model_info.get('function_sources_available', False)
        }
    })


@app.route('/api/search', methods=['POST'])
def search_tax_info():
    try:
        if tax_model is None:
            return jsonify({'success': False, 'error': 'Model not loaded'}), 500

        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No input provided'}), 400

        question = data.get('query') or data.get('question', '')
        if not question or len(question.strip()) < 3:
            return jsonify({'success': False, 'error': 'Question too short'}), 400

        logger.info(f"Processing: {question[:60]}...")

        response = tax_model['generate_response'](question, tax_model)

        formatted_response = {
            'success': True,
            'title': response.get('title', 'Sri Lankan Tax Information'),
            'source': response.get('source', 'AI-Generated from Sri Lankan Tax Regulations'),
            'answer': response.get('answer', 'No answer available'),
            'keyPoints': response.get('keyPoints', []),
            'example': response.get('example'),
            'confidence': round(response.get('confidence', 0.0) * 100, 1),
            'responseTime': round(response.get('responseTime', 0), 2)
        }

        return jsonify(formatted_response)

    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'answer': 'Error processing your question'
        }), 500


# === APPLICATION STARTUP ===
def startup_validation():
    logger.info("=" * 70)
    logger.info("STARTING SRI LANKAN TAX AI - FUNCTION SOURCE RECONSTRUCTION")
    logger.info("=" * 70)

    logger.info(f"PyTorch version: {torch.__version__}")
    logger.info(f"CUDA available: {torch.cuda.is_available()}")

    if torch.cuda.is_available():
        logger.info(f"CUDA device: {torch.cuda.get_device_name(0)}")
    else:
        logger.info("Using CPU for inference")

    logger.info("Loading trained model with function reconstruction...")
    if not load_trained_model():
        logger.error("Failed to load trained model")
        return False

    logger.info("=" * 70)
    logger.info("SRI LANKAN TAX AI MODEL LOADED SUCCESSFULLY!")
    logger.info("=" * 70)
    logger.info(f"Trained Functions: {model_info.get('has_trained_functions', False)}")
    logger.info(f"Function Sources Available: {model_info.get('function_sources_available', False)}")
    logger.info(f"Pickle Format: {model_info.get('pickle_format', 'Unknown')}")
    logger.info(f"Model Status: {model_info.get('status', 'Unknown')}")
    logger.info("=" * 70)

    return True


if __name__ == '__main__':
    if startup_validation():
        print("\nFlask server starting...")
        print("Your trained Tax AI model loaded successfully!")
        print("Access at: http://localhost:5000")
        print("API: http://localhost:5000/api/search")

        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load trained model from pickle file.")