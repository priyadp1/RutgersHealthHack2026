import streamlit as st

# Set the title of the app
st.title("Hello, World App")

# Display a header
st.header("Welcome to Streamlit!")

# Display some text
st.write("This is a basic Hello World application built with Python and Streamlit.")

# Add an interactive text input
user_name = st.text_input("What is your name?", "Stranger")

# Display a personalized greeting if the user enters a name
if user_name:
    st.success(f"Hello, {user_name}! 👋 Nice to meet you.")