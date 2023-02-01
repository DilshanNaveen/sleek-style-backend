FROM public.ecr.aws/lambda/python:3.8

RUN yum update -y && \
    yum install -y make && \
    yum install -y cmake && \
    yum install -y unzip && \
    yum install -y libtool && \
    yum install -y autoconf && \
    yum install -y automake && \
    yum install -y wget && \
    yum install -y gcc && \
    yum install -y gcc-c++ && \
    yum install -y pkgconfig && \
    yum install -y poppler-cpp-devel && \
    yum clean all

RUN /var/lang/bin/python3.8 -m pip install --upgrade pip
RUN pip3 install wheel requests
RUN pip3 install dlib==19.22.0

COPY requirements.txt  .
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy function code
COPY functions_only_save.py ${LAMBDA_TASK_ROOT}
COPY app.py ${LAMBDA_TASK_ROOT}
COPY all_features.csv ${LAMBDA_TASK_ROOT}
COPY face-shape-predictor.pkl ${LAMBDA_TASK_ROOT}
COPY sample.jpg ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ] 