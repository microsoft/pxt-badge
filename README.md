---
---

# MakeCode Badge

A framework to create electronic badges in MakeCode Arcade

## Configuration

Use the blocks in the ``badge`` namespace to configure your information in the badge.

```blocks
badge.setName("Cortana")
badge.setCompany("MakeCode")
badge.setSocial("TWITTER/LINKEDIN/GITHUB")
badge.start()
```

## Conference configuration

If you are planning to use this badge for a conference, we recommend that you
create a new project and add this extension as a dependency. Once the badge is conference,
you can share your extension with the conference goers. 

You can configure the name of the conference or draw a logo image.

```blocks
badge.setLogo("MAMAMA", 2)
```

Additional boot sequence can be registered. For example, 
this project https://github.com/microsoft/pxt-microsoft-boot-sequence
generates the Microsoft boot sequence.

You can specify a full conference program (in JavaScript only) as well.


## Supported targets

* for PXT/arcade
(The metadata above is needed for package search.)

# Microsoft Open Source Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).

Resources:

- [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/)
- [Microsoft Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
- Contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns

<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("https://arcade.makecode.com/", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
