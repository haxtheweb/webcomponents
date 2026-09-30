import { expect } from '@open-wc/testing'
import { MediaBehaviorsVideo } from '../media-behaviors.js'
import {
  sanitizeURLValue,
  sanitizeEmbeddableURL,
  hasUnsafeURLProtocol,
} from '@haxtheweb/utils/lib/url.js'

// media-behaviors is a utility module: it publishes a global helper object
// and a mixin, so exercise both implementations directly.
describe('MediaBehaviors.Video global helpers', () => {
  const Video = globalThis.MediaBehaviors.Video

  describe('getVideoType', () => {
    it('treats empty and non string sources as external', () => {
      expect(Video.getVideoType(null)).to.equal('external')
      expect(Video.getVideoType(undefined)).to.equal('external')
      expect(Video.getVideoType(12345)).to.equal('external')
      expect(Video.getVideoType('')).to.equal('external')
    })
    it('recognizes the major embed providers', () => {
      expect(Video.getVideoType('https://vimeo.com/12345')).to.equal('vimeo')
      expect(Video.getVideoType('https://www.youtube.com/watch?v=abc')).to.equal(
        'youtube',
      )
      expect(Video.getVideoType('https://youtu.be/abc')).to.equal('youtube')
      expect(Video.getVideoType('https://sketchfab.com/models/abc')).to.equal(
        'sketchfab',
      )
      expect(Video.getVideoType('https://www.twitch.tv/videos/123')).to.equal(
        'twitch',
      )
    })
    it('recognizes kaltura share and embed urls', () => {
      expect(
        Video.getVideoType('https://demo.mediaspace.kaltura.com/media/t/abc'),
      ).to.equal('kaltura')
      expect(
        Video.getVideoType(
          'https://demo.mediaspace.kaltura.com/embed/secure/iframe/entryId/abc/uiConfId/54679342/st/0',
        ),
      ).to.equal('kaltura')
    })
    it('treats kaltura urls outside the media paths as external', () => {
      expect(
        Video.getVideoType('https://demo.mediaspace.kaltura.com/other'),
      ).to.equal('external')
    })
    it('detects local media file formats case insensitively', () => {
      expect(Video.getVideoType('https://example.com/movie.MP4')).to.equal(
        'local',
      )
      expect(Video.getVideoType('files/sound.ogg')).to.equal('local')
      expect(Video.getVideoType('files/track.webm')).to.equal('local')
    })
    it('falls back to external for unknown sources', () => {
      expect(Video.getVideoType('https://example.com/watch/xyz')).to.equal(
        'external',
      )
    })
  })

  describe('_sourceIsIframe', () => {
    it('uses a video tag for local files and an iframe otherwise', () => {
      expect(Video._sourceIsIframe('https://example.com/movie.mp4')).to.equal(
        false,
      )
      expect(Video._sourceIsIframe('https://www.youtube.com/watch?v=abc')).to.equal(
        true,
      )
    })
  })

  describe('cleanVideoSource', () => {
    it('rejects unsafe sources', () => {
      expect(Video.cleanVideoSource('javascript:alert(1)', 'youtube')).to.equal(
        '',
      )
      expect(Video.cleanVideoSource('', 'youtube')).to.equal('')
    })
    it('passes local sources through untouched', () => {
      expect(
        Video.cleanVideoSource('https://example.com/movie.mp4', 'local'),
      ).to.equal('https://example.com/movie.mp4')
    })
    it('rewrites vimeo links into the cookie free player', () => {
      expect(Video.cleanVideoSource('https://vimeo.com/12345', 'vimeo')).to.equal(
        'https://player.vimeo.com/video/12345',
      )
    })
    it('normalizes vimeo api video paths', () => {
      expect(
        Video.cleanVideoSource('https://vimeo.com/videos/12345', 'vimeo'),
      ).to.equal('https://player.vimeo.com/video/12345')
    })
    it('leaves player vimeo links alone', () => {
      expect(
        Video.cleanVideoSource(
          'https://player.vimeo.com/video/12345',
          'vimeo',
        ),
      ).to.equal('https://player.vimeo.com/video/12345')
    })
    it('rewrites youtube watch links into embeds', () => {
      expect(
        Video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc123',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc123')
    })
    it('keeps additional youtube params on the embed url', () => {
      expect(
        Video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc&t=30',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc?t=30')
    })
    it('keeps every additional youtube param on the embed url', () => {
      expect(
        Video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc&t=30&list=xyz',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc?t=30&list=xyz')
    })
    it('ignores non v query params', () => {
      expect(
        Video.cleanVideoSource('https://www.youtube.com/watch?t=30', 'youtube'),
      ).to.equal('https://www.youtube.com/embed/')
    })
    it('rewrites youtube watch links without a query', () => {
      expect(
        Video.cleanVideoSource('https://www.youtube.com/watch', 'youtube'),
      ).to.equal('https://www.youtube.com/embed/')
    })
    it('rewrites youtube shorts links into embeds', () => {
      expect(
        Video.cleanVideoSource(
          'https://www.youtube.com/shorts/abc123',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc123')
    })
    it('rewrites youtube no cookie links', () => {
      expect(
        Video.cleanVideoSource(
          'https://www.youtube-no-cookie.com/embed/abc',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc')
    })
    it('rewrites youtu.be share links', () => {
      expect(Video.cleanVideoSource('https://youtu.be/abc123', 'youtube')).to.equal(
        'https://www.youtube.com/embed/abc123',
      )
    })
    it('keeps the query on player twitch links', () => {
      expect(
        Video.cleanVideoSource(
          'https://player.twitch.tv/?channel=foo&parent=www.example.com',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?channel=foo')
    })
    it('converts bare player twitch video links into video embeds', () => {
      expect(
        Video.cleanVideoSource(
          'https://player.twitch.tv/video/12345',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?video=12345')
    })
    it('converts bare player twitch channel links into channel embeds', () => {
      expect(
        Video.cleanVideoSource(
          'https://player.twitch.tv/somechannel',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?channel=somechannel')
    })
    it('converts twitch video links', () => {
      expect(
        Video.cleanVideoSource('https://www.twitch.tv/videos/12345', 'twitch'),
      ).to.equal('https://player.twitch.tv/?video=12345')
    })
    it('converts twitch channel links', () => {
      expect(
        Video.cleanVideoSource('https://www.twitch.tv/somechannel', 'twitch'),
      ).to.equal('https://player.twitch.tv/?channel=somechannel')
    })
    it('appends embed to sketchfab model urls', () => {
      expect(
        Video.cleanVideoSource(
          'https://sketchfab.com/models/abc',
          'sketchfab',
        ),
      ).to.equal('https://sketchfab.com/models/abc/embed')
    })
    it('leaves sketchfab embed urls alone', () => {
      expect(
        Video.cleanVideoSource(
          'https://sketchfab.com/models/abc/embed',
          'sketchfab',
        ),
      ).to.equal('https://sketchfab.com/models/abc/embed')
    })
    it('converts kaltura mediaspace share urls into secure embeds', () => {
      expect(
        Video.cleanVideoSource(
          'https://demo.mediaspace.kaltura.com/media/t/abc123/xyz1y2',
          'kaltura',
        ),
      ).to.equal(
        'https://demo.mediaspace.kaltura.com/embed/secure/iframe/entryId/abc123/uiConfId/54679342/st/0',
      )
    })
    it('passes kaltura urls without a media id through', () => {
      expect(
        Video.cleanVideoSource(
          'https://demo.mediaspace.kaltura.com/media/t/',
          'kaltura',
        ),
      ).to.equal('https://demo.mediaspace.kaltura.com/media/t/')
    })
    it('returns unknown sources unchanged', () => {
      expect(
        Video.cleanVideoSource('https://example.com/watch/xyz', 'external'),
      ).to.equal('https://example.com/watch/xyz')
    })
  })
})

describe('MediaBehaviorsVideo mixin', () => {
  class TestVideo extends MediaBehaviorsVideo(class {}) {}
  const video = new TestVideo()

  describe('getVideoType', () => {
    it('treats empty and non string sources as external', () => {
      expect(video.getVideoType(null)).to.equal('external')
      expect(video.getVideoType(12345)).to.equal('external')
      expect(video.getVideoType('')).to.equal('external')
    })
    it('recognizes the major embed providers', () => {
      expect(video.getVideoType('https://vimeo.com/12345')).to.equal('vimeo')
      expect(video.getVideoType('https://youtu.be/abc')).to.equal('youtube')
      expect(video.getVideoType('https://sketchfab.com/models/abc')).to.equal(
        'sketchfab',
      )
      expect(video.getVideoType('https://www.twitch.tv/videos/123')).to.equal(
        'twitch',
      )
      expect(
        video.getVideoType('https://demo.mediaspace.kaltura.com/media/t/abc'),
      ).to.equal('kaltura')
    })
    it('detects local media file formats', () => {
      expect(video.getVideoType('https://example.com/movie.mp4')).to.equal(
        'local',
      )
      expect(video.getVideoType('files/track.wav')).to.equal('local')
    })
    it('falls back to external for unknown sources', () => {
      expect(video.getVideoType('https://example.com/watch/xyz')).to.equal(
        'external',
      )
    })
  })

  describe('_sourceIsIframe', () => {
    it('uses a video tag for local files and an iframe otherwise', () => {
      expect(video._sourceIsIframe('files/sound.mp3')).to.equal(false)
      expect(video._sourceIsIframe('https://youtu.be/abc')).to.equal(true)
    })
  })

  describe('cleanVideoSource', () => {
    it('rejects unsafe sources', () => {
      expect(video.cleanVideoSource('javascript:alert(1)', 'youtube')).to.equal(
        '',
      )
      expect(video.cleanVideoSource('', 'youtube')).to.equal('')
    })
    it('passes local sources through untouched', () => {
      expect(
        video.cleanVideoSource('https://example.com/movie.mp4', 'local'),
      ).to.equal('https://example.com/movie.mp4')
    })
    it('rewrites vimeo links into the cookie free player', () => {
      expect(video.cleanVideoSource('https://vimeo.com/12345', 'vimeo')).to.equal(
        'https://player.vimeo.com/video/12345',
      )
    })
    it('normalizes vimeo api video paths', () => {
      expect(
        video.cleanVideoSource('https://vimeo.com/videos/12345', 'vimeo'),
      ).to.equal('https://player.vimeo.com/video/12345')
    })
    it('rewrites youtube watch links into embeds', () => {
      expect(
        video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc123',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc123')
    })
    it('keeps additional youtube params on the embed url', () => {
      expect(
        video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc&t=30',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc?t=30')
    })
    it('keeps every additional youtube param on the embed url', () => {
      expect(
        video.cleanVideoSource(
          'https://www.youtube.com/watch?v=abc&t=30&list=xyz',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc?t=30&list=xyz')
    })
    it('ignores non v query params', () => {
      expect(
        video.cleanVideoSource('https://www.youtube.com/watch?t=30', 'youtube'),
      ).to.equal('https://www.youtube.com/embed/')
    })
    it('rewrites youtube no cookie links', () => {
      expect(
        video.cleanVideoSource(
          'https://www.youtube-no-cookie.com/embed/abc',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc')
    })
    it('rewrites youtu.be share links', () => {
      expect(video.cleanVideoSource('https://youtu.be/abc123', 'youtube')).to.equal(
        'https://www.youtube.com/embed/abc123',
      )
    })
    it('rewrites youtube shorts links into embeds', () => {
      // the mixin delegates to the global helper so the shorts branch
      // behaves identically in both implementations
      expect(
        video.cleanVideoSource(
          'https://www.youtube.com/shorts/abc123',
          'youtube',
        ),
      ).to.equal('https://www.youtube.com/embed/abc123')
    })
    it('keeps the query on player twitch links', () => {
      expect(
        video.cleanVideoSource(
          'https://player.twitch.tv/?channel=foo&parent=www.example.com',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?channel=foo')
    })
    it('converts bare player twitch video links into video embeds', () => {
      expect(
        video.cleanVideoSource(
          'https://player.twitch.tv/video/12345',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?video=12345')
    })
    it('converts bare player twitch channel links into channel embeds', () => {
      expect(
        video.cleanVideoSource(
          'https://player.twitch.tv/somechannel',
          'twitch',
        ),
      ).to.equal('https://player.twitch.tv/?channel=somechannel')
    })
    it('converts twitch video links', () => {
      expect(
        video.cleanVideoSource('https://www.twitch.tv/videos/12345', 'twitch'),
      ).to.equal('https://player.twitch.tv/?video=12345')
    })
    it('converts twitch channel links', () => {
      expect(
        video.cleanVideoSource('https://www.twitch.tv/somechannel', 'twitch'),
      ).to.equal('https://player.twitch.tv/?channel=somechannel')
    })
    it('appends embed to sketchfab model urls', () => {
      expect(
        video.cleanVideoSource(
          'https://sketchfab.com/models/abc',
          'sketchfab',
        ),
      ).to.equal('https://sketchfab.com/models/abc/embed')
    })
    it('converts kaltura mediaspace share urls into secure embeds', () => {
      expect(
        video.cleanVideoSource(
          'https://demo.mediaspace.kaltura.com/media/t/abc123/xyz1y2',
          'kaltura',
        ),
      ).to.equal(
        'https://demo.mediaspace.kaltura.com/embed/secure/iframe/entryId/abc123/uiConfId/54679342/st/0',
      )
    })
    it('passes kaltura urls without a media id through', () => {
      expect(
        video.cleanVideoSource(
          'https://demo.mediaspace.kaltura.com/media/t/',
          'kaltura',
        ),
      ).to.equal('https://demo.mediaspace.kaltura.com/media/t/')
    })
    it('returns unknown sources unchanged', () => {
      expect(
        video.cleanVideoSource('https://example.com/watch/xyz', 'external'),
      ).to.equal('https://example.com/watch/xyz')
    })
  })
})

describe('url sanitization helpers used by media-behaviors', () => {
  it('flags unsafe protocols', () => {
    expect(hasUnsafeURLProtocol('javascript:alert(1)')).to.equal(true)
    expect(hasUnsafeURLProtocol('vbscript:msgbox(1)')).to.equal(true)
    expect(hasUnsafeURLProtocol('data:text/html,hi')).to.equal(true)
    expect(hasUnsafeURLProtocol('https://example.com')).to.equal(false)
    expect(hasUnsafeURLProtocol('example.com/no-protocol')).to.equal(false)
    expect(hasUnsafeURLProtocol('')).to.equal(false)
    expect(hasUnsafeURLProtocol(12345)).to.equal(false)
  })
  it('falls back for blank, non-string and unsafe values', () => {
    expect(sanitizeURLValue(null)).to.equal('')
    expect(sanitizeURLValue(undefined)).to.equal('')
    expect(sanitizeURLValue(12345)).to.equal('')
    expect(sanitizeURLValue('   ')).to.equal('')
    expect(sanitizeURLValue('javascript:alert(1)')).to.equal('')
    expect(sanitizeURLValue('  https://example.com  ')).to.equal(
      'https://example.com',
    )
  })
  it('only embeds http and https sources', () => {
    const fallback = 'https://fallback.example.com'
    expect(sanitizeEmbeddableURL('')).to.equal('')
    expect(
      sanitizeEmbeddableURL('ftp://files.example.com/x.mp4', fallback),
    ).to.equal(fallback)
    expect(sanitizeEmbeddableURL('javascript:alert(1)', fallback)).to.equal(
      fallback,
    )
    expect(sanitizeEmbeddableURL('https://example.com', fallback)).to.equal(
      'https://example.com',
    )
    expect(sanitizeEmbeddableURL('files/movie.mp4', fallback)).to.equal(
      'files/movie.mp4',
    )
    expect(sanitizeEmbeddableURL('http://', fallback)).to.equal(fallback)
  })
})
