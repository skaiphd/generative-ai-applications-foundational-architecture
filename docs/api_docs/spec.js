var spec = {
    "openapi": "3.0.2",
    "info": {
        "title": "Generative AI Foundational Platform API",
        "version": "0.1"
    },
    "paths": {
        "/model/async_invoke": {
            "post": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "Async Invoke Model Endpoint",
                "description": "## Endpoint to Invoke a Model on Bedrock Asynchronously\nThis endpoint allows users to invoke a model on Bedrock asynchronously using either a simple text prompt or a series of messages. It returns an invocation ID that can be used to retrieve the result later.\n\n***\n\n## Request Body\n\n| Parameter       | Type                                                      | Description                                                                                           |\n|-----------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------|\n| model_name      | str                                                       | The name of the model to invoke. Must be one of the supported models.                                  |\n| prompt          | str                                                       | A simple text prompt (str) or a list of messages (see below for message format).                       |\n| max_tokens      | Optional[int]                                             | The maximum number of tokens to generate in the response.                                             |\n| temperature     | Optional[float]                                           | Sampling temperature to use. Higher values make the output more random.                                |\n| top_p           | Optional[float]                                           | Probability threshold for nucleus sampling.                                                           |\n| top_k           | Optional[int]                                             | The number of highest probability vocabulary tokens to keep for top-k filtering.                       |\n| stop_sequences  | Optional[List[str]]                                       | Sequences where the generation will stop.                                                             |\n\n\n***\n\n#### Example:\n\n```json\n{\n    \"model_name\": \"example_model\",\n    \"prompt\": \"Translate the following text to French: 'Hello, how are you?'\",\n    \"max_tokens\": 100,\n    \"temperature\": 0.7,\n    \"top_p\": 0.9,\n    \"top_k\": 50,\n    \"stop_sequences\": [\"\\n\"]\n}\n```\n***\n## Response Body\n\n| Field          | Type   | Description                          |\n|----------------|--------|--------------------------------------|\n| invocation_id  | str    | The ID of the asynchronous invocation.|\n\n***\n#### Errors\n\n- **400 Bad Request**: If the request parameters are invalid.\n- **500 Internal Server Error**: If there is an unexpected error during model invocation.",
                "operationId": "async_invoke_model_endpoint_model_async_invoke_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/InvokeModelRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/model/async_output/{invocation_id}": {
            "get": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "Get Async Output",
                "description": "## Endpoint to Retrieve the Result of an Asynchronous Model Invocation\nThis endpoint allows users to retrieve the result of an asynchronous model invocation using the invocation ID returned by the async_invoke endpoint.\n\n***\n## Path Parameters\n\n| Parameter       | Type   | Description                          |\n|-----------------|--------|--------------------------------------|\n| invocation_id   | str    | The ID of the asynchronous invocation.|\n\n***\n## Response Body\n\n| Field          | Type   | Description                          |\n|----------------|--------|--------------------------------------|\n| status         | str    | The status of the invocation (SUCCESS or FAILED).|\n| result         | dict   | The result of the invocation.|\n\n***\n#### Errors\n\n- **404 Not Found**: If the invocation ID is not found or the result has expired.\n- **500 Internal Server Error**: If there is an unexpected error retrieving the result.",
                "operationId": "get_async_output_model_async_output__invocation_id__get",
                "parameters": [
                    {
                        "name": "invocation_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Invocation Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/model/service/health": {
            "get": {
                "tags": [
                    "Health"
                ],
                "summary": "Health Check",
                "operationId": "health_check_model_service_health_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/model/list_models": {
            "get": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "List Models",
                "description": "### Endpoint to List Supported Models and Their Model Names and Model IDs\n\n***\n\n#### Returns\n- **List[Dict[str, str]]**: A list of supported models with their names and IDs.\n\n***\n\n#### Response Body\n\n{\n    \"text_models\": [\n        {\n            \"model_name\": \"model_name\",\n            \"model_id\": \"model_id\"\n            }\n    ],\n    \"embed_models\": [\n        {\n            \"model_name\": \"model_name\",\n            \"model_id\": \"model_id\"\n        }\n    ]\n}\n\n***\n\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error listing the models.\n\n***\n\n#### Notes",
                "operationId": "list_models_model_list_models_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/model/invoke": {
            "post": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "Invoke Model",
                "description": "## Endpoint to Invoke a Model on Bedrock with Standardized Input\nThis endpoint allows users to invoke a model on Bedrock using either a simple text prompt or a series of messages. The request can include various optional parameters to control the model's behavior.\n\n***\n\n## Request Body\n\n| Parameter       | Type                                                      | Description                                                                                           |\n|-----------------|-----------------------------------------------------------|-------------------------------------------------------------------------------------------------------|\n| model_name      | str                                                       | The name of the model to invoke. Must be one of the supported models.                                  |\n| prompt          | Union[str, List[Dict[str, Union[str, List[Dict[str, str]]]]]] | A simple text prompt (str) or a list of messages (see below for message format).                       |\n| max_tokens      | Optional[int]                                             | The maximum number of tokens to generate in the response.                                             |\n| temperature     | Optional[float]                                           | Sampling temperature to use. Higher values make the output more random.                                |\n| top_p           | Optional[float]                                           | Probability threshold for nucleus sampling.                                                           |\n| top_k           | Optional[int]                                             | The number of highest probability vocabulary tokens to keep for top-k filtering.                       |\n| stop_sequences  | Optional[List[str]]                                       | Sequences where the generation will stop.                                                             |\n| system_prompts  | Optional[List[Dict[str, str]]]                            | A list of dictionaries for system prompts, each with a single key \"text\".                              |\n\n***\n\n#### Message Format for Prompt\n\n| Parameter | Type              | Description                                                        |\n|-----------|-------------------|--------------------------------------------------------------------|\n| role      | str               | The role of the message sender (e.g., \"user\", \"assistant\").        |\n| content   | List[Dict[str, str]] | A list of dictionaries, each containing a \"text\" key with the message content. |\n\n***\n\n#### Example 1: Simple Text Prompt\n```json\n{ \n    \"model_name\": \"example_model\", \n    \"prompt\": \"Translate the following text to French: 'Hello, how are you?'\", \n    \"max_tokens\": 100, \n    \"temperature\": 0.7, \n    \"top_p\": 0.9, \n    \"top_k\": 50, \n    \"stop_sequences\": [\"\\n\"] \n}\n```\n\n#### Example 2: Messages\n\n```json\n{ \n    \"model_name\": \"example_model\", \n    \"prompt\": [ \n        { \n            \"role\": \"user\", \n            \"content\": [{\"text\": \"What is the weather like today?\"}] \n        }, \n        { \n            \"role\": \"assistant\", \n            \"content\": [{\"text\": \"The weather is sunny with a high of 25°C.\"}] \n        } \n    ], \n    \"max_tokens\": 100, \n    \"temperature\": 0.7, \n    \"top_p\": 0.9, \n    \"top_k\": 50, \n    \"stop_sequences\": [\"\\n\"], \n    \"system_prompts\": [ \n        { \n            \"text\": \"Your system prompt here\" \n        } \n    ] \n}\n```\n\n***\n\n## Response Body\n\n| Field          | Type   | Description                          |\n|----------------|--------|--------------------------------------|\n| output_text    | str    | The generated text.                  |\n| input_tokens   | str    | The number of input tokens used.     |\n| output_tokens  | str    | The number of output tokens generated.|\n\n***\n\n#### Errors\n\n- **400 Bad Request**: If the request parameters are invalid.\n- **401 Unauthorized**: If the authorization header is missing or invalid.\n- **500 Internal Server Error**: If there is an unexpected error during model invocation.\n\n***\n\n#### Notes",
                "operationId": "invoke_model_model_invoke_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/InvokeModelRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/model/invoke_with_raw_input": {
            "post": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "Invoke Model With Raw Input",
                "description": "## Endpoint to Invoke a Model on Bedrock with Raw Input\nThis endpoint allows users to invoke a model on Bedrock with raw input.\n\n***\n\n#### Request Body\n\n| Parameter | Type   | Description                                                                     |\n|-----------|--------|---------------------------------------------------------------------------------|\n| model_id  | str    | The ID of the model to invoke.                                                  |\n| raw_input | dict   | The raw input for the model. Please check Bedrock documentation for model-specific input format. |\n\n***\n\n#### Response Body\n\n| Field          | Type   | Description                          |\n|----------------|--------|--------------------------------------|\n| output_text    | str    | The generated text.                  |\n| input_tokens   | str    | The number of input tokens used.     |\n| output_tokens  | str    | The number of output tokens generated.|\n\n***\n\n#### Errors\n\n- **400 Bad Request**: If the request parameters are invalid.\n- **401 Unauthorized**: If the authorization header is missing or invalid.\n- **500 Internal Server Error**: If there is an unexpected error during model invocation.\n\n\n***\n\n\n#### Notes",
                "operationId": "invoke_model_with_raw_input_model_invoke_with_raw_input_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/InvokeModelWithRawInputRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/model/embed": {
            "post": {
                "tags": [
                    "Model Invocation"
                ],
                "summary": "Invoke Embed",
                "description": "## Endpoint to Invoke Embed Models\nThis endpoint allows users to invoke embed models.\n\n***\n\n#### Request Body\n\n| Parameter    | Type       | Description                                                      |\n|--------------|------------|------------------------------------------------------------------|\n| model_name   | str        | The name of the model to invoke. Must be one of the supported models. |\n| input_text   | str        | The text to embed.                                               |\n\n***\n\n#### Response Body\n\n| Field          | Type   | Description                          |\n|----------------|--------|--------------------------------------|\n| output_text    | str    | The generated text.                  |\n| input_tokens   | str    | The number of input tokens used.     |\n| output_tokens  | str    | The number of output tokens generated.|\n\n***\n\n#### Errors\n\n- **400 Bad Request**: If the request parameters are invalid.\n- **401 Unauthorized**: If the authorization header is missing or invalid.\n- **500 Internal Server Error**: If there is an unexpected error during model invocation.\n\n***\n\n#### Notes",
                "operationId": "invoke_embed_model_embed_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/InvokeEmbedModelRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/create_job": {
            "get": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Create Extraction Job",
                "description": "## Endpoint to Create an Extraction Job\nThis endpoint creates an extraction job and returns the job ID that can be used to get the status of the job.\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the created job.       |\n| status              | str    | The status of the created job. Returns CREATED if the job is created successfully. |\n\n***\n\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error during the creation of the extraction job.",
                "operationId": "create_extraction_job_document_extraction_create_job_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/CreateExtractionResponse"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/chunking/create_job": {
            "post": {
                "tags": [
                    "Chunking"
                ],
                "summary": "Create Chunking Job",
                "description": "## Endpoint to Create a Chunking Job\nThis endpoint creates a chunking job and returns the job ID that can be used to get the status of the job.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| chunking_strategy   | str    | The chunking strategy to use.    |\n| chunking_params     | Optional[ChunkingParams] | Optional parameters for the chunking strategy. |\n\n***\n\n#### Chunking Strategies\n\n- **fixed_size**: Chunks the file into fixed-size segments.\n- **recursive**: Recursively splits the file into smaller segments based on a delimiter.\n\n***\n\n#### Chunking Parameters\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunk_size          | int    | The size of each chunk in character. |\n| chunk_overlap       | int    | The number of overlapping characters between chunks. |\n\n***\n\n## Example Request Body\n\n```json\n\n{\n    \"extraction_job_id\": \"123456\",\n    \"chunking_strategy\": \"fixed_size\",\n    \"chunking_params\": {\n        \"chunk_size\": 1000,\n        \"chunk_overlap\": 100\n    }\n}\n\n```\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the created job.       |\n| extraction_job_id   | str    | The ID of the extraction job.     |\n| status              | str    | The status of the created job. Returns WAITING_QUEUE_ALLOCATION if the job is created successfully. |\n| total_file_count    | int    | The total number of files to be chunked. |\n\n***\n\n#### Errors\n\n- **400 Bad Request**: If a chunking job with status 'WAITING_QUEUE_ALLOCATION' already exists.\n- **400 Bad Request**: If the extraction job is not in COMPLETED or COMPLETED_WITH_ERRORS state.\n- **500 Internal Server Error**: If there is an unexpected error during the creation of the chunking job.",
                "operationId": "create_chunking_job_document_chunking_create_job_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateChunkingJobRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/CreateChunkingJobResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/register_file": {
            "post": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Register File",
                "description": "## Endpoint to Register a File for Extraction\nThis endpoint registers a file for extraction and returns a presigned URL for the file upload.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| file_name           | str    | The name of the file to register. |\n\n***\n\n## Response Body\n\n | Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| file_name           | str    | The name of the registered file. |\n| file_id             | str    | The ID of the registered file.   |\n| upload_url          | str    | The presigned URL for file upload. |\n\n***\n\n#### Errors\n\n- **400 Bad Request**: If the file name is invalid or already registered for the job.\n- **500 Internal Server Error**: If there is an unexpected error during the registration of the file.",
                "operationId": "register_file_document_extraction_register_file_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/RegisterFileRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/RegisterFileResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/start_job": {
            "post": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Start Extraction Job",
                "description": "## Endpoint to Start an Extraction Job\nThis endpoint starts an extraction job by adding all registered files to the SQS queue for processing.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| total_files         | int    | The total number of files registered for the job. |\n| status              | str    | The status of the extraction job. Returns STARTED if the job is started successfully. |\n\n***\n\n#### Errors\n\n- **400**: If the job is already started or completed.\n- **404**: If the job ID is not found.\n- **500**: If any other error occurs during the start process.",
                "operationId": "start_extraction_job_document_extraction_start_job_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/StartExtractionJobRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/StartExtractionJobResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/job_files/{extraction_job_id}": {
            "get": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Get Files For Job",
                "description": "## Endpoint to Get Files for an Extraction Job\nThis endpoint returns a list of files registered for an extraction job.\n\n***\n\n## Request Parameters\n\n| Parameter           | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n\n***\n\n## Response Body\nList of json objects, each containing the following fields:\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| job_id              | str    | The ID of the extraction job.    |\n| file_name           | str    | The name of the file.            |\n| status              | str    | The status of the file. Can be COMPLETED, QUEUED, or FAILED. |\n\n***\n\n#### Errors\n\n- **404**: If the job ID is not found.\n- **500**: If any other error occurs during the retrieval of files.",
                "operationId": "get_files_for_job_document_extraction_job_files__extraction_job_id__get",
                "parameters": [
                    {
                        "name": "extraction_job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Extraction Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/GetExtractionJobFilesResponse"
                                    },
                                    "title": "Response Get Files For Job Document Extraction Job Files  Extraction Job Id  Get"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/job_status/{extraction_job_id}": {
            "get": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Get Job Status",
                "description": "## Endpoint to Get the Status of an Extraction Job\nThis endpoint returns the status of an extraction job.\n\n***\n\n## Request Parameters\n\n| Parameter           | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| job_id              | str    | The ID of the extraction job.    |\n| completed_file_count| int    | The number of files completed.   |\n| total_file_count    | int    | The total number of files.       |\n| failed_file_count   | int    | The number of files failed.      |\n| status              | str    | The status of the extraction job. Can be CREATED, STARTED, IN_PROGRESS, COMPLETED, or COMPLETED_WITH_ERRORS.          |\n\n***\n\n#### Errors\n\n- **404**: If the job ID is not found.\n- **500**: If any other error occurs during the retrieval of the job status.",
                "operationId": "get_job_status_document_extraction_job_status__extraction_job_id__get",
                "parameters": [
                    {
                        "name": "extraction_job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Extraction Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ExtractionJobStatusResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/file_status": {
            "post": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Get File Status",
                "description": "## Endpoint to Get the Status of a File from an Extraction Job\nThis endpoint returns the status of a file from an extraction job.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| file_name           | str    | The name of the file.            |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| status              | str    | The status of the file. Can be COMPLETED or QUEUED. |\n| result_url          | str    | The presigned URL for the extracted text file. |\n\n***\n\n#### Errors\n\n- **404**: If the file is not found.\n- **500**: If any other error occurs during the retrieval of the file status.",
                "operationId": "get_file_status_document_extraction_file_status_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ExtractionJobFileRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ExtractionJobFileResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/chunking/job_status/{job_id}": {
            "get": {
                "tags": [
                    "Chunking"
                ],
                "summary": "Get Job Status",
                "description": "## Endpoint to Get the Status of a Chunking Job\nThis endpoint returns the status of a chunking job.\n\n***\n\n## Request Parameters\n\n| Parameter           | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| job_id              | str    | The ID of the chunking job.      |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| status              | str    | The status of the chunking job. Can be QUEUED, IN_PROGRESS, COMPLETED, or FAILED. |\n| total_file_count    | int    | The total number of files to be chunked. |\n| completed_files     | int    | The number of files completed.   |\n| failed_files        | int    | The number of files failed.      |\n\n***\n\n#### Errors\n\n- **404**: If the job ID is not found.\n- **500**: If any other error occurs during the retrieval of the job status.",
                "operationId": "get_job_status_document_chunking_job_status__job_id__get",
                "parameters": [
                    {
                        "name": "job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/chunking/job_files/{job_id}": {
            "get": {
                "tags": [
                    "Chunking"
                ],
                "summary": "Get Files For Chunk Job",
                "description": "## Endpoint to Get Files for a Chunking Job\nThis endpoint returns a list of files associated with a chunking job.\n\n***\n\n## Request Parameters\n\n| Parameter           | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| job_id              | str    | The ID of the chunking job.      |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| files               | List   | List of files associated with the job. Each file contains the following fields: file_name, status, timestamp. |\n\n***\n\n#### Errors\n\n- **404**: If the job ID is not found.\n- **500**: If any other error occurs during the retrieval of files.",
                "operationId": "get_files_for_chunk_job_document_chunking_job_files__job_id__get",
                "parameters": [
                    {
                        "name": "job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/chunking/chunk_file_url": {
            "post": {
                "tags": [
                    "Chunking"
                ],
                "summary": "Get Chunk Job Results",
                "description": "## Endpoint to Get Chunk Job Results\nThis endpoint returns the presigned URL for the chunked file associated with a chunking job.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| file_name           | str    | The name of the file.            |\n\n***\n\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| file_name           | str    | The name of the file.            |\n| chunk_file_url      | str    | The presigned URL for the chunked file. |\n\n***\n\n#### Errors\n\n- **404**: If the job ID or file name is not found.\n- **500**: If any other error occurs during the retrieval of the chunked file.",
                "operationId": "get_chunk_job_results_document_chunking_chunk_file_url_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GetFileChunksRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/job_results/{extraction_job_id}": {
            "get": {
                "tags": [
                    "Extraction"
                ],
                "summary": "Get Job Results",
                "description": "## Endpoint to Get Extraction Job Results\nThis endpoint returns the results of an extraction job, including the extracted text and tables for each file.\n\n***\n\n## Request Parameters\n\n| Parameter           | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| extraction_job_id   | str    | The ID of the extraction job.    |\n\n***\n\n## Response Body\n\nA dictionary containing the file names as keys and the extracted text and tables URLs as values.\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| file_name           | str    | The name of the file.            |\n| extracted_text_url  | str    | The presigned URL for the extracted text. |\n| extracted_tables_url| str    | The presigned URL for the extracted tables. |\n\n***\n\n#### Errors\n\n- **404**: If the job ID is not found.\n- **400**: If the job is not completed yet.\n- **500**: If any other error occurs during the retrieval of the job results.",
                "operationId": "get_job_results_document_extraction_job_results__extraction_job_id__get",
                "parameters": [
                    {
                        "name": "extraction_job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Extraction Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/document/extraction/list_jobs": {
            "get": {
                "tags": [
                    "Extraction"
                ],
                "summary": "List Extraction Jobs",
                "description": "## Endpoint to List Extraction Jobs\nThis endpoint returns a list of extraction jobs associated with the app.\n\n***\n\n## Response Body\n\nList of json objects, each containing the following fields:\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| job_id              | str    | The ID of the extraction job.    |\n| status              | str    | The status of the extraction job. |\n| total_file_count    | int    | The total number of files to be extracted. |\n| completed_file_count| int    | The number of files completed.   |\n| failed_file_count   | int    | The number of files failed.      |\n| queued_files        | int    | The number of files queued.      |\n\n***\n\n#### Errors\n\n- **500**: If any other error occurs during the retrieval of jobs.",
                "operationId": "list_extraction_jobs_document_extraction_list_jobs_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/document/chunking/list_jobs": {
            "get": {
                "tags": [
                    "Chunking"
                ],
                "summary": "List Chunking Jobs",
                "description": "## Endpoint to List Chunking Jobs\nThis endpoint returns a list of chunking jobs associated with the app.\n\n***\n\n## Response Body\n\nList of json objects, each containing the following fields:\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| extraction_job_id   | str    | The ID of the extraction job.    |\n| status              | str    | The status of the chunking job. Can be QUEUED, IN_PROGRESS, COMPLETED, or FAILED. |\n| total_file_count    | int    | The total number of files to be chunked. |\n| completed_files     | int    | The number of files completed.   |\n| failed_files        | int    | The number of files failed.      |\n| chunking_strategy   | str    | The chunking strategy used.      |\n| chunking_params     | str    | The parameters used for the chunking strategy. |\n\n\n***\n\n#### Errors\n\n- **500**: If any other error occurs during the retrieval of jobs.",
                "operationId": "list_chunking_jobs_document_chunking_list_jobs_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/document/service/health": {
            "get": {
                "tags": [
                    "Health"
                ],
                "summary": "Health Check",
                "operationId": "health_check_document_service_health_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/create": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Create Opensearch Collection",
                "description": "## Endpoint to Create a Vector Store\nThis endpoint creates a vector store and returns the store ID that can be used to create an index.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_type          | str    | The type of the vector store.    |\n| description         | str    | The description of the vector store. |\n| tags                | Optional[Dict[str, str]] | Tags to associate with the vector store. |\n\n***\n\n## Example Request Body\n\n    ```json\n\n    {\n        \"store_type\": \"opensearchserverless\",\n        \"description\": \"A vector store for semantic search.\",\n        \"tags\": {\n            \"environment\": \"production\",\n            \"team\": \"data\"\n        }\n    }\n\n    ```\n\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_name          | str    | The name of the created store.   |\n| store_type          | str    | The type of the created store.   |\n| store_id            | str    | The ID of the created store.     |\n| message             | str    | A message indicating the status of the operation. |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the store type is not supported.\n- **500 Internal Server Error**: If there is an unexpected error during the creation of the vector store.",
                "operationId": "create_opensearch_collection_vector_store_create_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateVectorStoreRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/CreateVectorStoreResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/status": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Get Opensearch Collection Status",
                "description": "## Endpoint to Get Vector Store Status\nThis endpoint returns the status of the specified vector store.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_id            | str    | The ID of the vector store.      |\n\n***\n\n## Example Request Body\n\n    ```json\n\n    {\n        \"store_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\"\n    }\n\n    ```\n\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_id            | str    | The ID of the vector store.      |\n| status              | str    | The status of the vector store. Returns \"ACTIVE\", \"CREATING\", \"DELETING\", \"FAILED\" or \"NOT_FOUND\". |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the store is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the vector store status.",
                "operationId": "get_opensearch_collection_status_vector_store_status_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/VectorStoreStatusRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/VectorStoreStatusResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/index/create": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Create Opensearch Index",
                "description": "## Endpoint to Create an Index\nThis endpoint creates an index in the specified vector store.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_id            | str    | The ID of the vector store.      |\n| index_name          | str    | The name of the index to create. |\n\n***\n## Example Request Body\n\n    ```json\n\n    {\n        \"store_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\",\n        \"index_name\": \"my_index\"\n    }\n\n    ```\n\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| index_name          | str    | The name of the created index.   |\n| index_id            | str    | The ID of the created index.     |\n| store_id            | str    | The ID of the vector store.      |\n| store_type          | str    | The type of the vector store.    |\n| message             | str    | A message indicating the status of the operation. |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the store type is not supported.\n- **500 Internal Server Error**: If there is an unexpected error during the creation of the vector store.",
                "operationId": "create_opensearch_index_vector_store_index_create_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreateIndexRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/CreateIndexResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/index/status": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Get Opensearch Index Status",
                "description": "## Endpoint to Get Index Status\nThis endpoint returns the status of the specified index.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| index_id            | str    | The ID of the index.             |\n\n***\n## Example Request Body\n\n    ```json\n\n    {\n        \"index_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\"\n    }\n\n    ```\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| index_id            | str    | The ID of the index.             |\n| status              | str    | The status of the index. Returns \"ACTIVE\" or \"NOT_FOUND_OR_READY\". |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the index is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the index status.",
                "operationId": "get_opensearch_index_status_vector_store_index_status_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/VectorIndexStatusRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "additionalProperties": {
                                        "type": "string"
                                    },
                                    "type": "object",
                                    "title": "Response Get Opensearch Index Status Vector Store Index Status Post"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/stores/list": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "List Vector Stores",
                "description": "## Endpoint to List Vector Stores\nThis endpoint returns a list of vector stores.\n\n***\n## Response Body\n\n[\n    {\n        \"store_id\": \"<store_id>\",\n        \"store_type\": \"<store_type>\"\n    }\n]",
                "operationId": "list_vector_stores_vector_stores_list_post",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "additionalProperties": {
                                            "type": "string"
                                        },
                                        "type": "object"
                                    },
                                    "type": "array",
                                    "title": "Response List Vector Stores Vector Stores List Post"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/{store_id}/indexes": {
            "get": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "List Vector Store Indexes",
                "description": "## Endpoint to List Vector Store Indexes\nThis endpoint returns a list of indexes in the specified vector store.\n\n***\n## Request Parameters\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| store_id            | str    | The ID of the vector store.      |\n\n***\n## Response Body\n\n[\n    {\n        \"index_id\": \"<index_id>\",\n        \"index_name\": \"<index_name>\"\n    }\n]\n\n***\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the vector store indexes.",
                "operationId": "list_vector_store_indexes_vector_store__store_id__indexes_get",
                "parameters": [
                    {
                        "name": "store_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Store Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": {
                                            "type": "string"
                                        }
                                    },
                                    "title": "Response List Vector Store Indexes Vector Store  Store Id  Indexes Get"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/store/vectorize": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Vectorize And Store Chunk",
                "description": "## Endpoint to Vectorize and Store Chunks. \nThis endpoint triggers the vectorization and storage of chunks. It takes a reference to the chunking job that was completed and triggers the vectorization of the chunks.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| index_id            | str    | The ID of the index to store the vectors. |\n\n***\n\n## Example Request Body\n    \n        ```json\n    \n        {\n            \"chunking_job_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\",\n            \"index_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\"\n        }\n    \n        ```\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| vectorize_job_id    | str    | The ID of the vectorization job. |\n| vector_store_id     | str    | The ID of the vector store.      |\n| index_id            | str    | The ID of the index.             |\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| total_file_count    | int    | The total number of files to be vectorized. |\n| completed_file_count| int    | The number of files that have been vectorized. |\n| failed_file_count   | int    | The number of files that failed to be vectorized. |\n| status              | str    | The status of the vectorization job. |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the index or chunking job is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the vectorization process.",
                "operationId": "vectorize_and_store_chunk_vector_store_vectorize_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/VectorizeRequestChunkJobInput"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/VectorizationJobStatusResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/jobs/list": {
            "get": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "List Vectorization Jobs",
                "description": "## Endpoint to List Vectorization Jobs\nThis endpoint returns a list of vectorization jobs.\n\n***\n## Response Body\n\nList of json objects, each containing the following fields:\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| vectorize_job_id    | str    | The ID of the vectorization job. |\n| vector_store_id     | str    | The ID of the vector store.      |\n| index_id            | str    | The ID of the index.             |\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| created_at          | str    | The timestamp when the job was created. |\n| status              | str    | The status of the vectorization job. |\n| total_file_count    | int    | The total number of files to be vectorized. |\n| queued_files        | int    | The number of files that are queued for vectorization. |\n| completed_file_count| int    | The number of files that have been vectorized. |\n| failed_file_count   | int    | The number of files that failed to be vectorized. |\n\n\n***\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the vectorization jobs.",
                "operationId": "list_vectorization_jobs_vector_jobs_list_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/vector/job/status/{vectorize_job_id}": {
            "get": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Get Vectorize Job Status",
                "description": "## Endpoint to Get Vectorization Job Status\nThis endpoint returns the status of a vectorization job.\n\n***\n## Request Parameters\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| vectorize_job_id    | str    | The ID of the vectorization job. |\n\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| vectorize_job_id    | str    | The ID of the vectorization job. |\n| vector_store_id     | str    | The ID of the vector store.      |\n| index_id            | str    | The ID of the index.             |\n| chunking_job_id     | str    | The ID of the chunking job.      |\n| total_file_count    | int    | The total number of files to be vectorized. |\n| completed_file_count| int    | The number of files that have been vectorized. |\n| failed_file_count   | int    | The number of files that failed to be vectorized. |\n| status              | str    | The status of the vectorization job. |\n\n***\n#### Errors\n\n- **400 Bad Request**: If the vectorization job is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the vectorization process.",
                "operationId": "get_vectorize_job_status_vector_job_status__vectorize_job_id__get",
                "parameters": [
                    {
                        "name": "vectorize_job_id",
                        "in": "path",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "title": "Vectorize Job Id"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/VectorizationJobStatusResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/search": {
            "post": {
                "tags": [
                    "Vectorization"
                ],
                "summary": "Semantic Search",
                "description": "## Endpoint to Perform Semantic Search\nThis endpoint performs a semantic search using the specified query.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| query               | str    | The semantic search query.       |\n| index_id            | str    | The ID of the index to search.   |\n\n***\n\n## Example Request Body\n\n    ```json\n        \n        {\n            \"query\": \"what is AWS?\",\n            \"index_id\": \"b1c2b4c5-6d7e-8f9g-0h1i-2j3k4l5m6n7\"\n        }\n\n        ```\n***\n## Response Body\n\n[\n    {\n        \"text\": \"<text>\",\n    }\n]",
                "operationId": "semantic_search_vector_search_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/SemanticSearchRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "type": "object"
                                    },
                                    "type": "array",
                                    "title": "Response Semantic Search Vector Search Post"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/vector/service/health": {
            "get": {
                "tags": [
                    "Health"
                ],
                "summary": "Health Check",
                "operationId": "health_check_vector_service_health_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/prompt/service/health": {
            "get": {
                "tags": [
                    "Health"
                ],
                "summary": "Health Check",
                "operationId": "health_check_prompt_service_health_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        },
        "/prompt/template/save": {
            "post": {
                "tags": [
                    "Prompt Management"
                ],
                "summary": "Create Prompt Template",
                "description": "## Endpoint to Create a Prompt Template\nThis endpoint creates a prompt template and returns the template ID.\n\n***\n\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| name                | str    | The name of the prompt template. |\n| prompt_template     | str    | The prompt template.             |\n\n***\n## Example Request Body\n\n    ```json\n\n    {\n        \"name\": \"CHATBOT_PROMPT\",\n        \"prompt_template\": \"Given the following information, answer the question. Context {context}. Question {question}\"\n    }\n\n    ```\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| id                  | str    | The ID of the created prompt template. |\n| name                | str    | The name of the created prompt template. |\n| prompt_template     | str    | The prompt template.             |\n| version             | int    | The version of the created prompt template. |\n\n***\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error during the creation of the prompt template.",
                "operationId": "create_prompt_template_prompt_template_save_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/CreatePromptTemplateRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/TemplateResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/prompt/template/get": {
            "post": {
                "tags": [
                    "Prompt Management"
                ],
                "summary": "Get Prompt Template",
                "description": "## Endpoint to Get a Prompt Template\nThis endpoint gets the latest version of a prompt template by name.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| name                | str    | The name of the prompt template. |\n\n***\n## Example Request Body\n\n    ```json\n\n    {\n        \"name\": \"CHATBOT_PROMPT\"\n    }\n\n    ```\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| id                  | str    | The ID of the prompt template. |\n| name                | str    | The name of the prompt template. |\n| prompt_template     | str    | The prompt template.             |\n| version             | int    | The version of the prompt template. |\n\n***\n#### Errors\n\n- **404 Not Found**: If the prompt template is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the prompt template.",
                "operationId": "get_prompt_template_prompt_template_get_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GetPromptTemplateRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/TemplateResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/prompt/template/versions": {
            "post": {
                "tags": [
                    "Prompt Management"
                ],
                "summary": "Get All Prompt Template",
                "description": "## Endpoint to Get All Versions of a Prompt Template\nThis endpoint gets all versions of a prompt template by name.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| name                | str    | The name of the prompt template. |\n\n***\n## Example Request Body\n\n    ```json\n\n    {\n        \"name\": \"CHATBOT_PROMPT\"\n    }\n\n    ```\n***\n\n## Response Body\n\n[\n    {\n        \"id\": <str>,\n        \"name\": <str>,\n        \"prompt_template\": <str>,\n        \"version\": <int>\n    }\n]",
                "operationId": "get_all_prompt_template_prompt_template_versions_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GetPromptTemplateRequest"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "items": {
                                        "$ref": "#/components/schemas/TemplateResponse"
                                    },
                                    "type": "array",
                                    "title": "Response Get All Prompt Template Prompt Template Versions Post"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/prompt/template/version": {
            "post": {
                "tags": [
                    "Prompt Management"
                ],
                "summary": "Get Prompt Template Version",
                "description": "## Endpoint to Get a Specific Version of a Prompt Template\nThis endpoint gets a specific version of a prompt template by name and version.\n\n***\n## Request Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| name                | str    | The name of the prompt template. |\n| vnum                | int    | The version of the prompt template. |\n\n***\n\n## Example Request Body\n    \n        ```json\n    \n        {\n            \"name\": \"CHATBOT_PROMPT\",\n            \"vnum\": 1\n        }\n\n        ```\n***\n## Response Body\n\n| Field               | Type   | Description                      |\n|---------------------|--------|----------------------------------|\n| id                  | str    | The ID of the prompt template. |\n| name                | str    | The name of the prompt template. |\n| prompt_template     | str    | The prompt template.             |\n| version             | int    | The version of the prompt template. |\n\n***\n#### Errors\n\n- **404 Not Found**: If the prompt template version is not found.\n- **500 Internal Server Error**: If there is an unexpected error during the retrieval of the prompt template version.",
                "operationId": "get_prompt_template_version_prompt_template_version_post",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/GetPromptTemplateRequestByVersion"
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/TemplateResponse"
                                }
                            }
                        }
                    },
                    "422": {
                        "description": "Validation Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/HTTPValidationError"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/prompt/template/list": {
            "get": {
                "tags": [
                    "Prompt Management"
                ],
                "summary": "List Prompt Template",
                "description": "## Endpoint to List All Prompt Templates\nThis endpoint lists all prompt templates.\n\n***\n## Response Body\n```json\n{\n    \"<template_name>\": [\n        {\n            \"version\": <int>,\n            \"prompt_template\": <str>\n        }\n    ]\n}\n```\n\n***\n#### Errors\n\n- **500 Internal Server Error**: If there is an unexpected error during the listing of prompt templates.",
                "operationId": "list_prompt_template_prompt_template_list_get",
                "responses": {
                    "200": {
                        "description": "Successful Response",
                        "content": {
                            "application/json": {
                                "schema": {}
                            }
                        }
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "HTTPValidationError": {
                "properties": {
                    "detail": {
                        "items": {
                            "$ref": "#/components/schemas/ValidationError"
                        },
                        "type": "array",
                        "title": "Detail"
                    }
                },
                "type": "object",
                "title": "HTTPValidationError"
            },
            "InvokeEmbedModelRequest": {
                "properties": {
                    "model_name": {
                        "type": "string",
                        "title": "Model Name"
                    },
                    "input_text": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Input Text"
                    }
                },
                "type": "object",
                "required": [
                    "model_name"
                ],
                "title": "InvokeEmbedModelRequest"
            },
            "InvokeModelRequest": {
                "properties": {
                    "model_name": {
                        "type": "string",
                        "title": "Model Name"
                    },
                    "prompt": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "items": {
                                    "additionalProperties": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "items": {
                                                    "additionalProperties": {
                                                        "type": "string"
                                                    },
                                                    "type": "object"
                                                },
                                                "type": "array"
                                            }
                                        ]
                                    },
                                    "type": "object"
                                },
                                "type": "array"
                            }
                        ],
                        "title": "Prompt"
                    },
                    "max_tokens": {
                        "anyOf": [
                            {
                                "type": "integer"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Max Tokens"
                    },
                    "temperature": {
                        "anyOf": [
                            {
                                "type": "number"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Temperature"
                    },
                    "top_p": {
                        "anyOf": [
                            {
                                "type": "number"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Top P"
                    },
                    "top_k": {
                        "anyOf": [
                            {
                                "type": "integer"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Top K"
                    },
                    "stop_sequences": {
                        "anyOf": [
                            {
                                "items": {
                                    "type": "string"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Stop Sequences"
                    },
                    "system_prompts": {
                        "anyOf": [
                            {
                                "items": {
                                    "additionalProperties": {
                                        "anyOf": [
                                            {
                                                "type": "string"
                                            },
                                            {
                                                "items": {
                                                    "additionalProperties": {
                                                        "type": "string"
                                                    },
                                                    "type": "object"
                                                },
                                                "type": "array"
                                            }
                                        ]
                                    },
                                    "type": "object"
                                },
                                "type": "array"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "System Prompts",
                        "example": [
                            {
                                "text": "You are a helpful assistant."
                            }
                        ]
                    }
                },
                "type": "object",
                "required": [
                    "model_name",
                    "prompt"
                ],
                "title": "InvokeModelRequest"
            },
            "InvokeModelWithRawInputRequest": {
                "properties": {
                    "model_id": {
                        "type": "string",
                        "title": "Model Id"
                    },
                    "raw_input": {
                        "type": "object",
                        "title": "Raw Input"
                    }
                },
                "type": "object",
                "required": [
                    "model_id",
                    "raw_input"
                ],
                "title": "InvokeModelWithRawInputRequest"
            },
            "ValidationError": {
                "properties": {
                    "loc": {
                        "items": {
                            "anyOf": [
                                {
                                    "type": "string"
                                },
                                {
                                    "type": "integer"
                                }
                            ]
                        },
                        "type": "array",
                        "title": "Location"
                    },
                    "msg": {
                        "type": "string",
                        "title": "Message"
                    },
                    "type": {
                        "type": "string",
                        "title": "Error Type"
                    }
                },
                "type": "object",
                "required": [
                    "loc",
                    "msg",
                    "type"
                ],
                "title": "ValidationError"
            },
            "ChunkingParams": {
                "properties": {
                    "chunk_size": {
                        "anyOf": [
                            {
                                "type": "integer"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Chunk Size"
                    },
                    "chunk_overlap": {
                        "anyOf": [
                            {
                                "type": "integer"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Chunk Overlap"
                    }
                },
                "type": "object",
                "title": "ChunkingParams"
            },
            "ChunkingStrategy": {
                "type": "string",
                "enum": [
                    "fixed_size",
                    "recursive",
                    "page"
                ],
                "title": "ChunkingStrategy"
            },
            "CreateChunkingJobRequest": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "chunking_strategy": {
                        "$ref": "#/components/schemas/ChunkingStrategy"
                    },
                    "chunking_params": {
                        "anyOf": [
                            {
                                "$ref": "#/components/schemas/ChunkingParams"
                            },
                            {
                                "type": "null"
                            }
                        ]
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "chunking_strategy"
                ],
                "title": "CreateChunkingJobRequest"
            },
            "CreateChunkingJobResponse": {
                "properties": {
                    "chunking_job_id": {
                        "type": "string",
                        "title": "Chunking Job Id"
                    },
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    },
                    "total_file_count": {
                        "type": "integer",
                        "title": "Total File Count"
                    }
                },
                "type": "object",
                "required": [
                    "chunking_job_id",
                    "extraction_job_id",
                    "status",
                    "total_file_count"
                ],
                "title": "CreateChunkingJobResponse"
            },
            "CreateExtractionResponse": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "status": {
                        "$ref": "#/components/schemas/ExtractionJobStatus"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "status"
                ],
                "title": "CreateExtractionResponse"
            },
            "ExtractionJobFileRequest": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "file_name": {
                        "type": "string",
                        "title": "File Name"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "file_name"
                ],
                "title": "ExtractionJobFileRequest"
            },
            "ExtractionJobFileResponse": {
                "properties": {
                    "status": {
                        "type": "string",
                        "title": "Status"
                    },
                    "result_url": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Result Url"
                    },
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    }
                },
                "type": "object",
                "required": [
                    "status",
                    "extraction_job_id"
                ],
                "title": "ExtractionJobFileResponse"
            },
            "ExtractionJobStatus": {
                "type": "string",
                "enum": [
                    "CREATED",
                    "STARTED",
                    "COMPLETED",
                    "COMPLETED_WITH_ERRORS",
                    "FAILED"
                ],
                "title": "ExtractionJobStatus"
            },
            "ExtractionJobStatusResponse": {
                "properties": {
                    "job_id": {
                        "type": "string",
                        "title": "Job Id"
                    },
                    "completed_file_count": {
                        "type": "integer",
                        "title": "Completed File Count"
                    },
                    "total_file_count": {
                        "type": "integer",
                        "title": "Total File Count"
                    },
                    "failed_file_count": {
                        "type": "integer",
                        "title": "Failed File Count"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    }
                },
                "type": "object",
                "required": [
                    "job_id",
                    "completed_file_count",
                    "total_file_count",
                    "failed_file_count",
                    "status"
                ],
                "title": "ExtractionJobStatusResponse"
            },
            "GetExtractionJobFilesResponse": {
                "properties": {
                    "job_id": {
                        "type": "string",
                        "title": "Job Id"
                    },
                    "file_name": {
                        "type": "string",
                        "title": "File Name"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    }
                },
                "type": "object",
                "required": [
                    "job_id",
                    "file_name",
                    "status"
                ],
                "title": "GetExtractionJobFilesResponse"
            },
            "GetFileChunksRequest": {
                "properties": {
                    "chunking_job_id": {
                        "type": "string",
                        "title": "Chunking Job Id"
                    },
                    "file_name": {
                        "type": "string",
                        "title": "File Name"
                    }
                },
                "type": "object",
                "required": [
                    "chunking_job_id",
                    "file_name"
                ],
                "title": "GetFileChunksRequest"
            },
            "RegisterFileRequest": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "file_name": {
                        "type": "string",
                        "title": "File Name"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "file_name"
                ],
                "title": "RegisterFileRequest"
            },
            "RegisterFileResponse": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "file_name": {
                        "type": "string",
                        "title": "File Name"
                    },
                    "file_id": {
                        "type": "string",
                        "title": "File Id"
                    },
                    "upload_url": {
                        "type": "string",
                        "title": "Upload Url"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "file_name",
                    "file_id",
                    "upload_url"
                ],
                "title": "RegisterFileResponse"
            },
            "StartExtractionJobRequest": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id"
                ],
                "title": "StartExtractionJobRequest"
            },
            "StartExtractionJobResponse": {
                "properties": {
                    "extraction_job_id": {
                        "type": "string",
                        "title": "Extraction Job Id"
                    },
                    "total_files": {
                        "type": "integer",
                        "title": "Total Files"
                    },
                    "status": {
                        "allOf": [
                            {
                                "$ref": "#/components/schemas/ExtractionJobStatus"
                            }
                        ],
                        "default": "STARTED"
                    }
                },
                "type": "object",
                "required": [
                    "extraction_job_id",
                    "total_files"
                ],
                "title": "StartExtractionJobResponse"
            },
            "CreateIndexRequest": {
                "properties": {
                    "store_id": {
                        "type": "string",
                        "title": "Store Id"
                    },
                    "index_name": {
                        "type": "string",
                        "title": "Index Name"
                    }
                },
                "type": "object",
                "required": [
                    "store_id",
                    "index_name"
                ],
                "title": "CreateIndexRequest"
            },
            "CreateIndexResponse": {
                "properties": {
                    "index_name": {
                        "type": "string",
                        "title": "Index Name"
                    },
                    "index_id": {
                        "type": "string",
                        "title": "Index Id"
                    },
                    "store_id": {
                        "type": "string",
                        "title": "Store Id"
                    },
                    "store_type": {
                        "type": "string",
                        "title": "Store Type"
                    },
                    "message": {
                        "type": "string",
                        "title": "Message"
                    }
                },
                "type": "object",
                "required": [
                    "index_name",
                    "index_id",
                    "store_id",
                    "store_type",
                    "message"
                ],
                "title": "CreateIndexResponse"
            },
            "CreateVectorStoreRequest": {
                "properties": {
                    "store_name": {
                        "type": "string",
                        "title": "Store Name"
                    },
                    "store_type": {
                        "type": "string",
                        "title": "Store Type"
                    },
                    "description": {
                        "anyOf": [
                            {
                                "type": "string"
                            },
                            {
                                "type": "null"
                            }
                        ],
                        "title": "Description",
                        "default": "Collection for storing vectorized documents"
                    },
                    "tags": {
                        "items": {
                            "additionalProperties": {
                                "type": "string"
                            },
                            "type": "object"
                        },
                        "type": "array",
                        "title": "Tags",
                        "default": [
                            {
                                "key": "project",
                                "value": "GenerativeAI"
                            }
                        ]
                    }
                },
                "type": "object",
                "required": [
                    "store_name",
                    "store_type"
                ],
                "title": "CreateVectorStoreRequest"
            },
            "CreateVectorStoreResponse": {
                "properties": {
                    "store_name": {
                        "type": "string",
                        "title": "Store Name"
                    },
                    "store_type": {
                        "type": "string",
                        "title": "Store Type"
                    },
                    "store_id": {
                        "type": "string",
                        "title": "Store Id"
                    },
                    "message": {
                        "type": "string",
                        "title": "Message"
                    }
                },
                "type": "object",
                "required": [
                    "store_name",
                    "store_type",
                    "store_id",
                    "message"
                ],
                "title": "CreateVectorStoreResponse"
            },
            "SemanticSearchRequest": {
                "properties": {
                    "query": {
                        "type": "string",
                        "title": "Query"
                    },
                    "index_id": {
                        "type": "string",
                        "title": "Index Id"
                    }
                },
                "type": "object",
                "required": [
                    "query",
                    "index_id"
                ],
                "title": "SemanticSearchRequest"
            },
            "VectorIndexStatusRequest": {
                "properties": {
                    "index_id": {
                        "type": "string",
                        "title": "Index Id"
                    }
                },
                "type": "object",
                "required": [
                    "index_id"
                ],
                "title": "VectorIndexStatusRequest"
            },
            "VectorStoreStatusRequest": {
                "properties": {
                    "store_id": {
                        "type": "string",
                        "title": "Store Id"
                    }
                },
                "type": "object",
                "required": [
                    "store_id"
                ],
                "title": "VectorStoreStatusRequest"
            },
            "VectorStoreStatusResponse": {
                "properties": {
                    "store_id": {
                        "type": "string",
                        "title": "Store Id"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    }
                },
                "type": "object",
                "required": [
                    "store_id",
                    "status"
                ],
                "title": "VectorStoreStatusResponse"
            },
            "VectorizationJobStatusResponse": {
                "properties": {
                    "vectorize_job_id": {
                        "type": "string",
                        "title": "Vectorize Job Id"
                    },
                    "vector_store_id": {
                        "type": "string",
                        "title": "Vector Store Id"
                    },
                    "index_id": {
                        "type": "string",
                        "title": "Index Id"
                    },
                    "chunking_job_id": {
                        "type": "string",
                        "title": "Chunking Job Id"
                    },
                    "total_file_count": {
                        "type": "integer",
                        "title": "Total File Count"
                    },
                    "completed_file_count": {
                        "type": "integer",
                        "title": "Completed File Count"
                    },
                    "failed_file_count": {
                        "type": "integer",
                        "title": "Failed File Count"
                    },
                    "status": {
                        "type": "string",
                        "title": "Status"
                    }
                },
                "type": "object",
                "required": [
                    "vectorize_job_id",
                    "vector_store_id",
                    "index_id",
                    "chunking_job_id",
                    "total_file_count",
                    "completed_file_count",
                    "failed_file_count",
                    "status"
                ],
                "title": "VectorizationJobStatusResponse"
            },
            "VectorizeRequestChunkJobInput": {
                "properties": {
                    "chunking_job_id": {
                        "type": "string",
                        "title": "Chunking Job Id"
                    },
                    "index_id": {
                        "type": "string",
                        "title": "Index Id"
                    }
                },
                "type": "object",
                "required": [
                    "chunking_job_id",
                    "index_id"
                ],
                "title": "VectorizeRequestChunkJobInput"
            },
            "CreatePromptTemplateRequest": {
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "Name"
                    },
                    "prompt_template": {
                        "type": "string",
                        "title": "Prompt Template"
                    }
                },
                "type": "object",
                "required": [
                    "name",
                    "prompt_template"
                ],
                "title": "CreatePromptTemplateRequest"
            },
            "GetPromptTemplateRequest": {
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "Name"
                    }
                },
                "type": "object",
                "required": [
                    "name"
                ],
                "title": "GetPromptTemplateRequest"
            },
            "GetPromptTemplateRequestByVersion": {
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "Name"
                    },
                    "vnum": {
                        "type": "integer",
                        "title": "Vnum"
                    }
                },
                "type": "object",
                "required": [
                    "name",
                    "vnum"
                ],
                "title": "GetPromptTemplateRequestByVersion"
            },
            "TemplateResponse": {
                "properties": {
                    "id": {
                        "type": "string",
                        "title": "Id"
                    },
                    "name": {
                        "type": "string",
                        "title": "Name"
                    },
                    "prompt_template": {
                        "type": "string",
                        "title": "Prompt Template"
                    },
                    "version": {
                        "type": "integer",
                        "title": "Version"
                    }
                },
                "type": "object",
                "required": [
                    "id",
                    "name",
                    "prompt_template",
                    "version"
                ],
                "title": "TemplateResponse"
            }
        }
    }
}