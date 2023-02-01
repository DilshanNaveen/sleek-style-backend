FROM public.ecr.aws/lambda/python:3.8

# Install the function's dependencies using file requirements.txt
# from your project folder.

COPY requirements.txt  .

# RUN yum update -y && \
#     yum install -y make && \
#     yum install -y cmake && \
#     yum install -y unzip && \
#     yum install -y libtool && \
#     yum install -y autoconf && \
#     yum install -y automake && \
#     yum install -y wget && \
#     yum clean all

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
    yum clean all
        
# RUN pip3 install dlib
RUN  pip3 install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy function code
COPY app.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "app.handler" ]