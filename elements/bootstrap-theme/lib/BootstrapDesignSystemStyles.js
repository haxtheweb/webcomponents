import { css } from "lit";

export const BootstrapDesignSystemDataAttributes = css`
  [data-text-align="left"] {
    text-align: left;
  }
  [data-text-align="center"] {
    text-align: center;
  }
  [data-text-align="right"] {
    text-align: right;
  }
  [data-text-align="justify"] {
    text-align: justify;
  }

  @media (min-width: 992px) {
    [data-float-position="left"] {
      float: left;
      margin: 1rem 1.5rem 1rem 0;
    }
    [data-float-position="right"] {
      float: right;
      margin: 1rem 0 1rem 1.5rem;
    }
    [data-float-position="center"] {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

  [data-padding="xs"] {
    padding: 0.25rem;
  }
  [data-padding="s"] {
    padding: 0.5rem;
  }
  [data-padding="m"] {
    padding: 1rem;
  }
  [data-padding="l"] {
    padding: 1.5rem;
  }
  [data-padding="xl"] {
    padding: 2rem;
  }

  [data-margin="center"] {
    margin-left: auto;
    margin-right: auto;
  }
  [data-margin="xs"] {
    margin: 0.25rem;
  }
  [data-margin="s"] {
    margin: 0.5rem;
  }
  [data-margin="m"] {
    margin: 1rem;
  }
  [data-margin="l"] {
    margin: 1.5rem;
  }
  [data-margin="xl"] {
    margin: 2rem;
  }

  [data-bootstrap-surface="subtle"] {
    background-color: rgba(33, 37, 41, 0.06);
  }
  [data-bootstrap-surface="strong"] {
    background-color: #212529;
    color: #f8f9fa;
  }
  [data-bootstrap-surface="outline"] {
    border: 1px solid rgba(33, 37, 41, 0.2);
  }

  [data-bootstrap-emphasis="lead"] {
    font-size: 1.25rem;
    font-weight: 300;
  }
  [data-bootstrap-emphasis="small"] {
    font-size: 0.875rem;
  }
  [data-bootstrap-emphasis="muted"] {
    opacity: 0.75;
  }
  [data-bootstrap-emphasis="strong"] {
    font-weight: 700;
  }

  [data-border-radius="xs"] {
    border-radius: 0.125rem;
  }
  [data-border-radius="sm"] {
    border-radius: 0.25rem;
  }
  [data-border-radius="md"] {
    border-radius: 0.5rem;
  }
  [data-border-radius="lg"] {
    border-radius: 1rem;
  }

  [data-box-shadow="sm"] {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
  [data-box-shadow="md"] {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
  [data-box-shadow="lg"] {
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
  }
`;

export const BootstrapDesignSystemStyles = [BootstrapDesignSystemDataAttributes];
